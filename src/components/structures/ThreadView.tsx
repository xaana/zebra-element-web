import React, { createRef, KeyboardEvent } from "react";
import {
    Thread,
    THREAD_RELATION_TYPE,
    ThreadEvent,
    Room,
    RoomEvent,
    IEventRelation,
    MatrixEvent,
} from "matrix-js-sdk/src/matrix";
import { logger } from "matrix-js-sdk/src/logger";
import classNames from "classnames";
import BaseCard from "matrix-react-sdk/src/components/views/right_panel/BaseCard";
import { RightPanelPhases } from "matrix-react-sdk/src/stores/right-panel/RightPanelStorePhases";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import { RoomPermalinkCreator } from "matrix-react-sdk/src/utils/permalinks/Permalinks";
import { Layout } from "matrix-react-sdk/src/settings/enums/Layout";
import TimelinePanel from "matrix-react-sdk/src/components/structures/TimelinePanel";
import dis from "matrix-react-sdk/src/dispatcher/dispatcher";
import { ActionPayload } from "matrix-react-sdk/src/dispatcher/payloads";
import { Action } from "matrix-react-sdk/src/dispatcher/actions";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { E2EStatus } from "matrix-react-sdk/src/utils/ShieldUtils";
import EditorStateTransfer from "matrix-react-sdk/src/utils/EditorStateTransfer";
import RoomContext, { TimelineRenderingType } from "matrix-react-sdk/src/contexts/RoomContext";
import ContentMessages from "matrix-react-sdk/src/ContentMessages";
import UploadBar from "matrix-react-sdk/src/components/structures/UploadBar";
import { _t } from "matrix-react-sdk/src/languageHandler";
import ThreadListContextMenu from "matrix-react-sdk/src/components/views/context_menus/ThreadListContextMenu";
import RightPanelStore from "matrix-react-sdk/src/stores/right-panel/RightPanelStore";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { ViewRoomPayload } from "matrix-react-sdk/src/dispatcher/payloads/ViewRoomPayload";
import FileDropTarget from "matrix-react-sdk/src/components/structures/FileDropTarget";
import { getKeyBindingsManager } from "matrix-react-sdk/src/KeyBindingsManager";
import { KeyBindingAction } from "matrix-react-sdk/src/accessibility/KeyboardShortcuts";
import Measured from "matrix-react-sdk/src/components/views/elements/Measured";
import PosthogTrackers from "matrix-react-sdk/src/PosthogTrackers";
import { ButtonEvent } from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import Spinner from "matrix-react-sdk/src/components/views/elements/Spinner";
import { ComposerInsertPayload, ComposerType } from "matrix-react-sdk/src/dispatcher/payloads/ComposerInsertPayload";
import Heading from "matrix-react-sdk/src/components/views/typography/Heading";
import { SdkContextClass } from "matrix-react-sdk/src/contexts/SDKContext";
import { ThreadPayload } from "matrix-react-sdk/src/dispatcher/payloads/ThreadPayload";
import { RoomUpload } from "matrix-react-sdk/src/models/RoomUpload";

import { DocFile } from "../views/rooms/FileSelector";
import MessageComposer from "../views/rooms/MessageComposer";
import ZebraAlert from "../ui/ZebraAlert";

import { MatrixFile as File } from "@/plugins/files/types";
import { shouldSetTimeOutForComposer } from "@/utils/MessageUtils";

interface IProps {
    room: Room;
    onClose: () => void;
    resizeNotifier: ResizeNotifier;
    mxEvent: MatrixEvent;
    permalinkCreator?: RoomPermalinkCreator;
    e2eStatus?: E2EStatus;
    initialEvent?: MatrixEvent;
    isInitialEventHighlighted?: boolean;
    initialEventScrollIntoView?: boolean;
}

interface IState {
    thread?: Thread;
    lastReply?: MatrixEvent | null;
    layout: Layout;
    editState?: EditorStateTransfer;
    replyToEvent?: MatrixEvent;
    narrow: boolean;
    database: string;
    files: DocFile[];
    showStop: boolean;
    botStreamId?: string;
    canSend: boolean;
    knowledge:boolean;
}

export default class ThreadView extends React.Component<IProps, IState> {
    public static contextType = RoomContext;
    public context!: React.ContextType<typeof RoomContext>;

    private dispatcherRef: string | null = null;
    private readonly layoutWatcherRef: string;
    private timelinePanel = createRef<TimelinePanel>();
    private card = createRef<HTMLDivElement>();

    // Set by setEventId in ctor.
    private eventId!: string;

    public constructor(props: IProps) {
        super(props);

        this.setEventId(this.props.mxEvent);
        const thread = this.props.room.getThread(this.eventId) ?? undefined;

        this.setupThreadListeners(thread);
        this.state = {
            layout: SettingsStore.getValue("layout"),
            narrow: false,
            thread,
            lastReply: thread?.lastReply((ev: MatrixEvent) => {
                return ev.isRelation(THREAD_RELATION_TYPE.name) && !ev.status;
            }),
            database: "",
            files: [],
            showStop: false,
            botStreamId: "",
            canSend: true,
            knowledge: false,
        };
        this.updateCanSend = this.updateCanSend.bind(this);

        this.layoutWatcherRef = SettingsStore.watchSetting("layout", null, (...[, , , value]) =>
            this.setState({ layout: value as Layout }),
        );
    }

    public componentDidMount(): void {
        if (this.state.thread) {
            this.postThreadUpdate(this.state.thread);
            for (let i = this.state.thread.timeline.length - 1; i >= 0; i--) {
                if (this.state.thread.timeline[i]?.getContent().database) {
                    this.setState({ database: this.state.thread.timeline[i].getContent().database, files: [],knowledge: false });
                    break;
                } else if (this.state.thread.timeline[i]?.getContent().fileSelected) {
                    const fileList = this.state.thread.timeline[i].getContent().fileSelected.map((file: DocFile) => {
                        if (
                            this.props.room &&
                            file.eventId &&
                            !this.props.room.findEventById(file.eventId)?.isRedacted()
                        ) {
                            return file;
                        } else if (!file.eventId) {
                            return file;
                        }
                    });
                    const filteredList = fileList.filter((item) => item !== undefined);
                    this.setState({ files: filteredList, database: "",knowledge: false });
                    break;
                } else if (this.state.thread.timeline[i]?.getContent().web) {
                    this.setState({ database: "", files: [],knowledge: false });
                    break;
                }else if(this.state.thread.timeline[i]?.getContent().knowledge){
                    this.setState({database: "", files: [],knowledge: true});
                }
            }
            const pdfUrls = localStorage.getItem(this.eventId);
            if (pdfUrls) {
                const urls = JSON.parse(pdfUrls);
                Object.keys(urls).forEach((key: any) => {
                    if (urls[key].url) {
                        URL.revokeObjectURL(urls[key].url);
                    }
                })
                localStorage.removeItem(this.eventId);
            }
            this.updateCanSend();
        }

        this.setupThread(this.props.mxEvent);
        this.dispatcherRef = dis.register(this.onAction);

        this.props.room.on(ThreadEvent.New, this.onNewThread);
    }

    public componentWillUnmount(): void {
        if (this.dispatcherRef) dis.unregister(this.dispatcherRef);
        const roomId = this.props.mxEvent.getRoomId();
        SettingsStore.unwatchSetting(this.layoutWatcherRef);
        const pdfUrls = localStorage.getItem(this.eventId);
        if (pdfUrls) {
            const urls = JSON.parse(pdfUrls);
            Object.keys(urls).forEach((key: any) => {
                if (urls[key].url) {
                    URL.revokeObjectURL(urls[key].url);
                }
            })
            localStorage.removeItem(this.eventId);
        }
        const hasRoomChanged = SdkContextClass.instance.roomViewStore.getRoomId() !== roomId;
        if (this.props.initialEvent && !hasRoomChanged) {
            dis.dispatch<ViewRoomPayload>({
                action: Action.ViewRoom,
                room_id: this.props.room.roomId,
                metricsTrigger: undefined, // room doesn't change
            });
        }

        dis.dispatch<ThreadPayload>({
            action: Action.ViewThread,
            thread_id: null,
        });

        this.state.thread?.off(ThreadEvent.NewReply, this.updateThreadRelation);
        this.props.room.off(RoomEvent.LocalEchoUpdated, this.updateThreadRelation);
        this.props.room.removeListener(ThreadEvent.New, this.onNewThread);
    }

    public updateCanSend(): void {
            const threadStart = this.state.thread?.events.length === 1;
            if (!threadStart&&this.state.lastReply) {
                const shouldSetTimeOut = shouldSetTimeOutForComposer(this.state.lastReply,this.props.room);
                if (shouldSetTimeOut) {
                    this.setState({canSend: false})
                    setTimeout(() => {
                        this.setState({canSend: true})
                    },4000)
                }
                
            }
    }

    public componentDidUpdate(prevProps: IProps,prevState: IState): void {
        if (prevProps.mxEvent !== this.props.mxEvent) {
            this.setEventId(this.props.mxEvent);
            this.setupThread(this.props.mxEvent);
        }

        if (prevProps.room !== this.props.room) {
            RightPanelStore.instance.setCard({ phase: RightPanelPhases.RoomSummary });
        }
        if (prevState.lastReply !== this.state.lastReply) {
            this.updateCanSend();
        }
    }

    private setEventId(event: MatrixEvent): void {
        if (!event.getId()) {
            throw new Error("Got thread event without id");
        }

        this.eventId = event.getId()!;
    }

    private mergeUniqueByMediaId(first: DocFile[], second: DocFile[]): DocFile[] {
        // Create a Set from mediaIds of the first list for quick lookup
        const mediaIdSet = new Set(first.map((item) => item.mediaId));

        // Filter out objects in the second list whose mediaId is not in the Set
        const uniqueFromSecond = second.filter((item) => !mediaIdSet.has(item.mediaId));

        // Concatenate the first list with the unique items from the second list
        return first.concat(uniqueFromSecond);
    }

    private onAction = (payload: ActionPayload): void => {
        if (payload.phase == RightPanelPhases.ThreadView && payload.event) {
            this.setupThread(payload.event);
        }
        switch (payload.action) {
            case Action.ComposerInsert: {
                if (payload.composerType) break;
                if (payload.timelineRenderingType !== TimelineRenderingType.Thread) break;

                // re-dispatch to the correct composer
                dis.dispatch<ComposerInsertPayload>({
                    ...(payload as ComposerInsertPayload),
                    composerType: this.state.editState ? ComposerType.Edit : ComposerType.Send,
                });
                break;
            }

            case Action.EditEvent:
                // Quit early if it's not a thread context
                if (payload.timelineRenderingType !== TimelineRenderingType.Thread) return;
                // Quit early if that's not a thread event
                if (payload.event && !payload.event.getThread()) return;
                this.setState(
                    {
                        editState: payload.event ? new EditorStateTransfer(payload.event) : undefined,
                    },
                    () => {
                        if (payload.event) {
                            this.timelinePanel.current?.scrollToEventIfNeeded(payload.event.getId());
                        }
                    },
                );
                break;
            case "reply_to_event":
                if (payload.context === TimelineRenderingType.Thread) {
                    this.setState({
                        replyToEvent: payload.event,
                    });
                }
                break;
            case "scroll_to_bottom":
                if (payload.timelineRenderingType === TimelineRenderingType.Thread) {
                    this.timelinePanel.current?.jumpToLiveTimeline();
                }
                break;
            case "select_database":
                if (payload.context === TimelineRenderingType.Thread) {
                    this.setState({
                        database: payload.database,
                        files: [],
                        knowledge: false,
                    });
                }
                break;
            case "select_knowledge":
                if (payload.context === TimelineRenderingType.Thread) {
                    this.setState({
                        database: "",
                        files: [],
                        knowledge: payload.knowledge,
                    });
                }
                break;
            case "select_files":
                if (payload.context === TimelineRenderingType.Thread) {
                    const mergedFiles = this.mergeUniqueByMediaId(this.state.files, payload.files);
                    if (payload.roomId === this.props.room.roomId) {
                        if (payload.files.length > 0 && mergedFiles.length > this.state.files.length) {
                            const fileList = mergedFiles.map((file: DocFile) => {
                                if (
                                    this.props.room &&
                                    file.eventId &&
                                    (!this.props.room.findEventById(file.eventId)?.isRedacted() ||
                                        !this.props.room.findEventById(file.eventId))
                                ) {
                                    return {
                                        mediaId: file.mediaId,
                                        name: file.name,
                                        eventId: file.eventId,
                                        roomId: file.roomId,
                                    };
                                } else if (!file.eventId) {
                                    return {
                                        mediaId: file.mediaId,
                                        name: file.name,
                                    };
                                }
                            });
                            const filteredList = fileList.filter((item) => item !== undefined);
                            const hasDocument = filteredList.some((file) => /\.(pdf|docx|doc)$/i.test(file.name));
                            let filteredFiles = filteredList;

                            // If there is a document, remove all images from the list
                            if (hasDocument) {
                                filteredFiles = filteredList.filter(
                                    (file) => !/\.(jpeg|jpg|png|gif|webp)$/i.test(file.name),
                                );
                            }
                            if (filteredFiles.length > 5) {
                                filteredFiles.splice(5, filteredList.length - 5);
                            }
                            this.setState({
                                database: "",
                                files: filteredFiles,
                                knowledge:false,
                            });
                        } else if (payload.files.length > 0 && mergedFiles.length === this.state.files.length) {
                            this.setState({
                                database: "",
                                files: payload.files,
                                knowledge:false,
                            });
                        } else {
                            this.setState({
                                files: [],
                            });
                        }
                    }
                }
                break;
            default:
                break;
        }
    };

    private setupThread = (mxEv: MatrixEvent): void => {
        /** presence of event Id has been ensured by {@link setEventId} */
        const eventId = mxEv.getId()!;

        let thread = this.props.room.getThread(eventId);

        if (!thread) {
            const events = [];
            // if the event is still being sent, don't include it in the Thread yet - otherwise the timeline panel
            // will attempt to show it twice (once as a regular event, once as a pending event) and everything will
            // blow up
            if (mxEv.status === null) events.push(mxEv);
            thread = this.props.room.createThread(eventId, mxEv, events, true);
        }

        this.updateThread(thread);
    };

    private onNewThread = (thread: Thread): void => {
        if (thread.id === this.props.mxEvent.getId()) {
            this.setupThread(this.props.mxEvent);
        }
    };

    private updateThreadRelation = (): void => {
        this.setState({
            lastReply: this.threadLastReply,
        });
        if (this.state.botStreamId && this.threadLastReply?.getId() !== this.state.botStreamId) {
            this.setState({ showStop: false });
        }
        if (this.threadLastReply?.getContent().open === "open" && !this.threadLastReply?.getContent().database) {
            this.threadLastReply.getId() && this.setState({ botStreamId: this.threadLastReply.getId() });
            this.setState({ showStop: true });
        }
    };
    public stopBotStream = (): void => {
        this.setState({ showStop: false });
        //send http request for endpoint in the bot.
        const payload = {
            eventId: this.state.botStreamId,
        };
        const url = `${SettingsStore.getValue("botApiUrl")}/stop_streaming`;
        const request = new Request(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        fetch(request)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
    };

    private get threadLastReply(): MatrixEvent | undefined {
        return (
            this.state.thread?.lastReply((ev: MatrixEvent) => {
                return ev.isRelation(THREAD_RELATION_TYPE.name) && !ev.status;
            }) ?? undefined
        );
    }

    private updateThread = (thread?: Thread): void => {
        if (this.state.thread === thread) return;
        const rootId = this.state.thread?.rootEvent?.getId();
        if(rootId){
            const pdfUrls = localStorage.getItem(rootId);
            if (pdfUrls) {
                const urls = JSON.parse(pdfUrls);
                Object.keys(urls).forEach((key: any) => {
                    if (urls[key].url) {
                        URL.revokeObjectURL(urls[key].url);
                    }
                })
                localStorage.removeItem(rootId);
            }
        }
        
        this.setupThreadListeners(thread, this.state.thread);
        if (thread) {
            this.setState(
                {
                    thread,
                    lastReply: this.threadLastReply,
                },
                async () => this.postThreadUpdate(thread),
            );
            for (let i = thread.timeline.length - 1; i >= 0; i--) {
                if (thread.timeline[i]?.getContent().database) {
                    this.setState({ database: thread.timeline[i].getContent().database, files: [] });
                    break;}
                else if(thread.timeline[i]?.getContent().knowledge){
                    this.setState({ knowledge: true, database: '', files: [] });
                    break;   
                } else if (thread.timeline[i]?.getContent().fileSelected) {
                    const fileList = thread.timeline[i].getContent().fileSelected.map((file: DocFile) => {
                        if (
                            this.props.room &&
                            file.eventId &&
                            !this.props.room.findEventById(file.eventId)?.isRedacted()
                        ) {
                            return file;
                        } else if (!file.eventId) {
                            return file;
                        }
                    });
                    const filteredList = fileList.filter((item) => item !== undefined);
                    this.setState({ files: filteredList, database: "" ,knowledge: false});
                    break;
                } else if (thread.timeline[i]?.getContent().web) {
                    this.setState({ database: "", files: [] ,knowledge: false});
                    break;
                }
            }
        }
    };

    private async postThreadUpdate(thread: Thread): Promise<void> {
        dis.dispatch<ThreadPayload>({
            action: Action.ViewThread,
            thread_id: thread.id,
        });
        thread.emit(ThreadEvent.ViewThread);
        this.updateThreadRelation();
        this.timelinePanel.current?.refreshTimeline(this.props.initialEvent?.getId());
    }

    private setupThreadListeners(thread?: Thread | undefined, oldThread?: Thread | undefined): void {
        if (oldThread) {
            this.state.thread?.off(ThreadEvent.NewReply, this.updateThreadRelation);
            this.props.room.off(RoomEvent.LocalEchoUpdated, this.updateThreadRelation);
        }
        if (thread) {
            thread.on(ThreadEvent.NewReply, this.updateThreadRelation);
            this.props.room.on(RoomEvent.LocalEchoUpdated, this.updateThreadRelation);
        }
    }

    private resetJumpToEvent = (event?: string): void => {
        if (
            this.props.initialEvent &&
            this.props.initialEventScrollIntoView &&
            event === this.props.initialEvent?.getId()
        ) {
            dis.dispatch<ViewRoomPayload>({
                action: Action.ViewRoom,
                room_id: this.props.room.roomId,
                event_id: this.props.initialEvent?.getId(),
                highlighted: this.props.isInitialEventHighlighted,
                scroll_into_view: false,
                replyingToEvent: this.state.replyToEvent,
                metricsTrigger: undefined, // room doesn't change
            });
        }
    };

    private onMeasurement = (narrow: boolean): void => {
        this.setState({ narrow });
    };

    private onKeyDown = (ev: KeyboardEvent): void => {
        let handled = false;

        const action = getKeyBindingsManager().getRoomAction(ev);
        switch (action) {
            case KeyBindingAction.UploadFile: {
                dis.dispatch(
                    {
                        action: "upload_file",
                        context: TimelineRenderingType.Thread,
                    },
                    true,
                );
                handled = true;
                break;
            }
        }

        if (handled) {
            ev.stopPropagation();
            ev.preventDefault();
        }
    };

    private onFileDrop = (dataTransfer: DataTransfer): void => {
        const roomId = this.props.mxEvent.getRoomId();
        if (roomId) {
            ContentMessages.sharedInstance().sendContentListToRoom(
                Array.from(dataTransfer.files),
                roomId,
                this.threadRelation,
                MatrixClientPeg.safeGet(),
                TimelineRenderingType.Thread,
            );
        } else {
            console.warn("Unknwon roomId for event", this.props.mxEvent);
        }
    };

    private get threadRelation(): IEventRelation {
        const relation: IEventRelation = {
            rel_type: THREAD_RELATION_TYPE.name,
            event_id: this.state.thread?.id,
            is_falling_back: true,
        };

        const fallbackEventId = this.state.lastReply?.getId() ?? this.state.thread?.id;
        if (fallbackEventId) {
            relation["m.in_reply_to"] = {
                event_id: fallbackEventId,
            };
        }

        return relation;
    }

    private renderThreadViewHeader = (): JSX.Element => {
        return (
            <div className="mx_BaseCard_header_title">
                <Heading size="4" className="mx_BaseCard_header_title_heading">
                    {_t("common|thread")}
                </Heading>
                <ThreadListContextMenu mxEvent={this.props.mxEvent} permalinkCreator={this.props.permalinkCreator} />
            </div>
        );
    };

    private checkInThread = (uploads: RoomUpload[]): boolean => {
        for (const upload of uploads) {
            if (upload.relation?.rel_type === THREAD_RELATION_TYPE.name) {
                return true;
            }
            return false;
        }
    };

    public render(): React.ReactNode {
        const highlightedEventId = this.props.isInitialEventHighlighted ? this.props.initialEvent?.getId() : undefined;

        const threadRelation = this.threadRelation;

        let timeline: JSX.Element | null;
        if (this.state.thread) {
            if (this.props.initialEvent && this.props.initialEvent.getRoomId() !== this.state.thread.roomId) {
                logger.warn(
                    "ThreadView attempting to render TimelinePanel with mismatched initialEvent",
                    this.state.thread.roomId,
                    this.props.initialEvent.getRoomId(),
                    this.props.initialEvent.getId(),
                );
            }

            timeline = (
                <>
                    <FileDropTarget parent={this.card.current} onFileDrop={this.onFileDrop} />
                    <TimelinePanel
                        key={this.state.thread.id}
                        ref={this.timelinePanel}
                        showReadReceipts={this.context.showReadReceipts}
                        manageReadReceipts={true}
                        manageReadMarkers={true}
                        sendReadReceiptOnLoad={true}
                        timelineSet={this.state.thread.timelineSet}
                        showUrlPreview={this.context.showUrlPreview}
                        // ThreadView doesn't support IRC layout at this time
                        layout={this.state.layout === Layout.Bubble ? Layout.Bubble : Layout.Group}
                        hideThreadedMessages={false}
                        hidden={false}
                        showReactions={true}
                        className="mx_RoomView_messagePanel"
                        permalinkCreator={this.props.permalinkCreator}
                        membersLoaded={true}
                        editState={this.state.editState}
                        eventId={this.props.initialEvent?.getId()}
                        highlightedEventId={highlightedEventId}
                        eventScrollIntoView={this.props.initialEventScrollIntoView}
                        onEventScrolledIntoView={this.resetJumpToEvent}
                    />
                </>
            );
        } else {
            timeline = (
                <div className="mx_RoomView_messagePanelSpinner">
                    <Spinner />
                </div>
            );
        }

        return (
            <RoomContext.Provider
                value={{
                    ...this.context,
                    timelineRenderingType: TimelineRenderingType.Thread,
                    threadId: this.state.thread?.id,
                    liveTimeline: this.state?.thread?.timelineSet?.getLiveTimeline(),
                    narrow: this.state.narrow,
                }}
            >
                <BaseCard
                    className={classNames("mx_ThreadView mx_ThreadPanel", {
                        mx_ThreadView_narrow: this.state.narrow,
                    })}
                    onClose={this.props.onClose}
                    withoutScrollContainer={true}
                    header={this.renderThreadViewHeader()}
                    ref={this.card}
                    onKeyDown={this.onKeyDown}
                    onBack={(ev: ButtonEvent) => {
                        PosthogTrackers.trackInteraction("WebThreadViewBackButton", ev);
                    }}
                >
                    {this.card.current && <Measured sensor={this.card.current} onMeasurement={this.onMeasurement} />}
                    <div className="mx_ThreadView_timelinePanelWrapper">{timeline}</div>

                    {this.checkInThread(ContentMessages.sharedInstance().getCurrentUploads(threadRelation)) &&
                        (ContentMessages.sharedInstance().getCurrentUploads(threadRelation).length > 0 ||
                            SdkContextClass.instance.roomViewStore.getUploading()) && (
                            <UploadBar room={this.props.room} relation={threadRelation} />
                        )}

                    {this.state.thread?.timelineSet && (
                        <>
                            <MessageComposer
                                room={this.props.room}
                                resizeNotifier={this.props.resizeNotifier}
                                relation={threadRelation}
                                replyToEvent={this.state.replyToEvent}
                                permalinkCreator={this.props.permalinkCreator}
                                e2eStatus={this.props.e2eStatus}
                                compact={true}
                                database={this.state.database}
                                files={this.state.files}
                                showStop={this.state.showStop}
                                stopBotStream={this.stopBotStream}
                                canSend={this.state.canSend}
                                knowledge={this.state.knowledge}
                            />
                            <ZebraAlert />
                        </>
                    )}
                </BaseCard>
            </RoomContext.Provider>
        );
    }
}
