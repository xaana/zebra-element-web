/*
Copyright 2021 The Matrix.org Foundation C.I.C.

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

import React, { useContext, useEffect } from "react";
import { MatrixEvent, MatrixError, IPreviewUrlResponse, MatrixClient } from "matrix-js-sdk/src/matrix";
import { logger } from "matrix-js-sdk/src/logger";
import { useStateToggle } from "matrix-react-sdk/src/hooks/useStateToggle";
import AccessibleButton from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
import { _t } from "matrix-react-sdk/src/languageHandler";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";
import { useAsyncMemo } from "matrix-react-sdk/src/hooks/useAsyncMemo";

import LinkPreviewWidget from "./LinkPreviewWidget";

const INITIAL_NUM_PREVIEWS = 2;

interface IProps {
    links: string[]; // the URLs to be previewed
    mxEvent: MatrixEvent; // the Event associated with the preview
    onCancelClick(): void; // called when the preview's cancel ('hide') button is clicked
    onHeightChanged?(): void; // called when the preview's contents has loaded
}

const LinkPreviewGroup: React.FC<IProps> = ({ links, mxEvent, onCancelClick, onHeightChanged }) => {
    const cli = useContext(MatrixClientContext);
    const [expanded, toggleExpanded] = useStateToggle();

    const ts = mxEvent.getTs();
    const previews = useAsyncMemo<[string, IPreviewUrlResponse][]>(
        async () => {
            console.log('fetching previews for ', links,ts);
            return fetchPreviews(cli, links, ts);
        },
        [links, ts],
        [],
    );

    useEffect(() => {
        onHeightChanged?.();
    }, [onHeightChanged, expanded, previews]);

    const showPreviews = expanded ? previews : previews.slice(0, INITIAL_NUM_PREVIEWS);
    let toggleButton: JSX.Element | undefined;
    if (previews.length > INITIAL_NUM_PREVIEWS) {
        toggleButton = (
            <AccessibleButton onClick={toggleExpanded}>
                {expanded
                    ? _t("action|collapse")
                    : _t("timeline|url_preview|show_n_more", { count: previews.length - showPreviews.length })}
            </AccessibleButton>
        );
    }

    return (
        <div className="mx_LinkPreviewGroup border border-black border-solid rounded-lg mt-2">
            <div className="relative">
            <AccessibleButton
                className="mx_LinkPreviewGroup_hide cursor-pointer top-1 right-0 absolute text-xs"
                onClick={onCancelClick}
                aria-label={_t("timeline|url_preview|close")}
            >
                <img
                    className="text-black"
                    alt=""
                    role="presentation"
                    src={require("../../../../res/img/cancel.svg").default}
                    width="18"
                    height="18"
                />
            </AccessibleButton>
            </div>
            {showPreviews.map(([link, preview], i) => (
                <LinkPreviewWidget key={link} link={link} preview={preview} mxEvent={mxEvent}>
                    
                </LinkPreviewWidget>
            ))}
            {toggleButton}
        </div>
    );
};

const fetchPreviews = (cli: MatrixClient, links: string[], ts: number): Promise<[string, IPreviewUrlResponse][]> => {
    return Promise.all<[string, IPreviewUrlResponse] | void>(
        links.map(async (link): Promise<[string, IPreviewUrlResponse] | undefined> => {
            try {
                const preview = await cli.getUrlPreview(link, ts);
                console.log(preview)
                // Ensure at least one of the rendered fields is truthy
                if (
                    preview?.["og:image"]?.startsWith("mxc://") ||
                    !!preview?.["og:description"] ||
                    !!preview?.["og:title"]
                ) {
                    return [link, preview];
                }
            } catch (error) {
                if (error instanceof MatrixError && error.httpStatus === 404) {
                    // Quieten 404 Not found errors, not all URLs can have a preview generated
                    logger.debug("Failed to get URL preview: ", error);
                } else {
                    logger.error("Failed to get URL preview: ", error);
                }
            }
        }),
    ).then((a) => a.filter(Boolean)) as Promise<[string, IPreviewUrlResponse][]>;
};

export default LinkPreviewGroup;
