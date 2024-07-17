import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as HtmlUtils from "matrix-react-sdk/src/HtmlUtils";
import SettingsStore from 'matrix-react-sdk/src/settings/SettingsStore';
import { WebSearchSourceItem, WebSearchSources } from '@/components/web/WebSearchSources';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, List } from 'lucide-react';
import { DocFile } from '../rooms/FileSelector';
import { IContent } from 'matrix-js-sdk/src/matrix';
import { useMatrixClientContext } from 'matrix-react-sdk/src/contexts/MatrixClientContext';
import { ImageViewer } from '@/components/pdf/ImageViewer';
import FilesPill from '@/components/ui/FilesPill';

interface IProps {
  roomId?: string;
  eventId?: string;
  rawQuestion?: string;
  content: IContent
}

const ZebraStream: React.FC<IProps> = ({ roomId, eventId,rawQuestion,content }) => { 
    const [markdown, setMarkdown] = useState("");
    const [webSource, setWebSource] = useState<WebSearchSourceItem[]>([]);
    const [isImage, setIsImage] = useState(false);
    const decoder = useMemo(() => new TextDecoder(), [])
    const client = useMatrixClientContext();
    useEffect(() => {
        

        if(content.type === "web")fetchWebStream();
        if (content.type === "pdf"){
            fetchPdfStream();
            const temp = content.fileSelected[0].name.split(".");
            if(["png", "jpg", "jpeg", "webp", "gif"].includes(temp[temp.length-1])) setIsImage(true);
        }
        if (content.type === "knowledge") fetchZiggyStream();

        return () => {
            // Cleanup logic if needed, e.g., aborting the fetch
        };

    }, []);
    const fetchWebStream = async () => {
        try {
            const payload = {
                roomId: roomId,
                firstMessageEventId: eventId,
                question: rawQuestion,
                eventId:content.questionId,
            };
            const url = `${SettingsStore.getValue("botApiUrl")}/web_stream`;
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            
            // Check if response.body is not null
            if (response.body) {
                const reader = response.body.getReader();
                let firstChunk = true;
                const readStream = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }
                    // Decode the stream chunk to text
                    const chunk = decoder.decode(value, { stream: true });
                    // console.log("Stream chunk:", JSON.parse(chunk));
                    if (firstChunk) {
                        firstChunk = false;
                        const webCitations: WebSearchSourceItem[] = JSON.parse(chunk).source_links.map((item: string) => {
                            const url = new URL(item);
                            return {
                                link: item,
                                hostname: url.hostname,
                            };
                        });
                        if(JSON.parse(chunk).content) {setMarkdown(JSON.parse(chunk).content);}
                        setWebSource(webCitations);
                    }else{
                        const temp = chunk.split("$_$");
                        if(temp[1]&&temp[1]!=="") setMarkdown(temp[1]);
                        else{
                            setMarkdown(temp[0]);
                        }
                        
                    }
                    

                    // Read the next chunk
                    await readStream();
                };

                await readStream();
            } else {
                console.error('Response body is null.');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    const fetchPdfStream = async () => {
        try {
            const payload = {
                roomId: roomId,
                firstMessageEventId: eventId,
                question: rawQuestion,
                eventId:content.questionId,
                mediaIds: content.fileSelected,
                webFlag: content.web_flag,
                pdfSummary: content.pdf_summary
                
            };
            const url = `${SettingsStore.getValue("botApiUrl")}/pdf_query_stream`;
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            
            // Check if response.body is not null
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                const readStream = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }
                    // Decode the stream chunk to text
                    const chunk = decoder.decode(value, { stream: true });
                    // console.log("Stream chunk:", JSON.parse(chunk));
                    const temp = chunk.split("$_$");
                    if(temp[1]&&temp[1]!=="") setMarkdown(temp[1]);
                    else{
                        setMarkdown(temp[0]);
                    }
                    // Read the next chunk
                    await readStream();
                };

                await readStream();
            } else {
                console.error('Response body is null.');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    const fetchZiggyStream = async () => {
        try {
            const payload = {
                roomId: roomId,
                firstMessageEventId: eventId,
                question: rawQuestion,
                eventId:content.questionId,
                pipeline: content.pipeline
                
            };
            const url = `${SettingsStore.getValue("botApiUrl")}/pipeline_stream`;
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            
            // Check if response.body is not null
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                const readStream = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }
                    // Decode the stream chunk to text
                    const chunk = decoder.decode(value, { stream: true });
                    // console.log("Stream chunk:", JSON.parse(chunk));
                    const temp = chunk.split("$_$");
                    if(temp[1]&&temp[1]!=="") setMarkdown(temp[1]);
                    else{
                        setMarkdown(temp[0]);
                    }
                    // Read the next chunk
                    await readStream();
                };

                await readStream();
            } else {
                console.error('Response body is null.');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    const getSectionTitle = (title: string, Icon: React.FC | null): React.ReactNode => {
        return (
            <div className="flex flex-row items-center">
                {Icon && <Icon />}
                <div className="text-base font-bold m-2">{title}:</div>
            </div>
        );
    }

    if(!content.fetching) return null
    if (markdown === "") return (<div>Thinking...</div>)
    const getDisplayQuestion = () => {
        if (rawQuestion && rawQuestion.length > 58) {
            const temp = rawQuestion.substring(0, 58);
            const question = temp.split(" ").slice(0, -1).join(" ") + "...";
            return question
        }
        else{
            return rawQuestion
        }
    }
    return (
        <div>
            <div className="p-4">
                    <h2>
                        <strong>{getDisplayQuestion()}</strong>
                    </h2>
                    {webSource ? (
                        <WebSearchSources data={webSource} />
                    ) : (
                        <Skeleton className="w-full h-[30px] rounded-full" />
                    )}
                    {isImage && content.type === "pdf"&&(
                        <div className="flex flex-row items-center gap-x-2">
                        {getSectionTitle("Source", List)}
                        {content.fileSelected.map(
                            (file: DocFile) =>
                                roomId && (
                                    <ImageViewer key={eventId} eventId={file.eventId!} room={client.getRoom(roomId)!} />
                                ),
                        )}
                    </div>
                    )}
                    {content.type === "pdf"&&!isImage&&(
                        <>
                            {getSectionTitle("Source", List)}
                            <div className="flex flex-row gap-x-1 overflow-auto my-4">
                            {content.fileSelected.map((file: DocFile) => (
                                <FilesPill key={file.mediaId} file={file} roomId={roomId} />
                            ))}
                            </div>
                        </>
                    )}
                    <Separator />
                    {getSectionTitle("Answer", Bell)}
                    {HtmlUtils.bodyToHtml({format: "org.matrix.custom.html", formatted_body: markdown},[],{})}
            </div>
            
        </div>
    )
}

// Export the component
export default ZebraStream;
