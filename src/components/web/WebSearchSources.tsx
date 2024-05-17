import React from "react";

import { Tooltip, TooltipTrigger } from "../ui/tooltip";

export type WebSearchSourceItem = {
    // title: string
    link: string;
    hostname: string;
};
export const WebSearchSources = ({ data }: { data: WebSearchSourceItem[] }):React.JSX.Element => {
    return (
        <>
            {data && data.length > 0 && (
                <>
                    <div className="text-base text-muted-foreground font-bold mt-1 mb-1">
                        Sources:
                    </div>
                    <div className="flex-row mt-4 items-center flex-wrap grid grid-cols-5 gap-4 my-4">
                        {data.map((item, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-muted-foreground p-1 border rounded-md cursor-pointer block items-center gap-1 hover:bg-blue-100"
                                    >
                                        <img
                                            // src={`https://${item.hostname}/favicon.ico`}
                                            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.hostname}`}
                                            alt="Favicon"
                                            className="h-6 w-6"
                                            // onError={handleFaviconError}
                                        />
                                        <span>{item.hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")}</span>
                                    </a>
                                </TooltipTrigger>
                                {/* <TooltipContent>{item.title}</TooltipContent> */}
                            </Tooltip>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
