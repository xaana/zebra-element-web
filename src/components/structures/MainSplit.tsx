/*
Copyright 2018 New Vector Ltd
Copyright 2019 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { ReactNode } from "react";
import { NumberSize, Resizable } from "matrix-react-sdk/node_modules/re-resizable";
import { Direction } from "matrix-react-sdk/node_modules/re-resizable/lib/resizer";
import ResizeNotifier from "matrix-react-sdk/src/utils/ResizeNotifier";
import RightPanelStore from "matrix-react-sdk/src/stores/right-panel/RightPanelStore";

interface IProps {
    resizeNotifier: ResizeNotifier;
    collapsedRhs?: boolean;
    panel?: JSX.Element;
    children: ReactNode;
    /**
     * A unique identifier for this panel split.
     *
     * This is appended to the key used to store the panel size in localStorage, allowing the widths of different
     * panels to be stored.
     */
    sizeKey?: string;
    /**
     * The size to use for the panel component if one isn't persisted in storage. Defaults to 350.
     */
    defaultSize: string | number;
}

interface IState {
    collapseRightPanel: boolean;
    children?: React.JSX.Element
}

const MainSplitBodyView = (props: {
    bodyView: React.ReactNode,
    onClick: () => void,
}): React.JSX.Element => {
    return (
        <div style={{
            display: "flex",
            flex: "1 1 0%",
            WebkitBoxOrient: "vertical",
            WebkitBoxDirection:"normal",
            flexDirection:"column",
            WebkitBoxFlex:1,
            minWidth:0
            }}
            onClick={props.onClick}>
            {props.bodyView}
        </div>
    )
}

export default class MainSplit extends React.Component<IProps, IState> {
    public constructor(props:IProps) {
        super(props);
        this.state = {
            collapseRightPanel: false,
        }
    }
    public static defaultProps = {
        defaultSize: 350,
    };

    private onResizeStart = (): void => {
        this.props.resizeNotifier.startResizing();
    };

    private onResize = (): void => {
        this.props.resizeNotifier.notifyRightHandleResized();
    };

    // private parseWidth = (widthStr:string):number => {
    //     let result = parseInt(widthStr);
    //     if (widthStr.includes('%')) {
    //         const parentWidth = element.parentNode.clientWidth;
    //         result = (result / 100) * parentWidth;
    //     }
    //     return result;
    // }

    private get sizeSettingStorageKey(): string {
        let key = "mx_rhs_size";
        if (!!this.props.sizeKey) {
            key += `_${this.props.sizeKey}`;
        }
        return key;
    }

    private onResizeStop = (
        event: MouseEvent | TouchEvent,
        direction: Direction,
        elementRef: HTMLElement,
        delta: NumberSize,
    ): void => {
        this.props.resizeNotifier.stopResizing();
        // window.localStorage.setItem(
        //     this.sizeSettingStorageKey,
        //     // (this.loadSidePanelSize().width + delta.width).toString(),
        //     this.loadSidePanelSize().width.toString(),
        // );
    };

    private loadSidePanelSize(): { height: string | number; width: string | number } {
        // let rhsSize = parseInt(window.localStorage.getItem(this.sizeSettingStorageKey)!, 10);
        // let rhsSize = window.localStorage.getItem(this.sizeSettingStorageKey);
        // if (!rhsSize) {
        //     rhsSize = this.props.defaultSize;
        // }
        // if (rhsSize < )
        return {
            height: "100%",
            width: this.props.defaultSize,
        };
    }

    public render(): React.ReactNode {
        const bodyView = React.Children.only(this.props.children);
        const panelView = this.props.panel;

        const hasResizer = !this.props.collapsedRhs && panelView && !this.state.collapseRightPanel;

        let children;
        if (hasResizer) {
            children = <Resizable
                key={this.props.sizeKey}
                defaultSize={this.loadSidePanelSize()}
                minWidth={264}
                maxWidth="95%"
                enable={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: true,
                    topRight: false,
                    bottomRight: false,
                    bottomLeft: false,
                    topLeft: false,
                }}
                onResizeStart={this.onResizeStart}
                onResize={this.onResize}
                onResizeStop={this.onResizeStop}
                className="mx_RightPanel_ResizeWrapper shadow-2xl"
                handleClasses={{ left: "mx_ResizeHandle--horizontal" }}
            >
                {this.state.collapseRightPanel ? undefined : panelView}
            </Resizable>
        }
        return (
            <div className="mx_MainSplit">
                <MainSplitBodyView
                    bodyView={bodyView}
                    onClick={()=>{
                        if (hasResizer){
                            RightPanelStore.instance.togglePanel(null)
                        }
                    }}
                />
                {children}
            </div>
        );
    }
}
