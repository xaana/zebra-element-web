import React from "react";
import { List } from "lucide-react";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";

export type WebSearchSourceItem = {
    // title: string
    link: string;
    hostname: string;
};
export const WebSearchSources = ({ data }: { data: WebSearchSourceItem[] }): React.JSX.Element => {
    return (
        <>
            {data && data.length > 0 && (
                <>
                    <div className="flex flex-row items-center">
                        <List />
                        <div className="text-base font-bold m-2">Sources:</div>
                    </div>

                    <div className="flex-row mt-4 items-center flex-wrap grid grid-cols-5 gap-4 my-4">
                        {data.map((item, index) => (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <a
                                        href={item.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="source-button p-1 rounded-lg cursor-pointer block items-center gap-1 hover:bg-grey-500"
                                    >
                                        <img
                                            // src={`https://${item.hostname}/favicon.ico`}
                                            src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.hostname}`}
                                            alt="Favicon"
                                            className="h-6 w-6"
                                            // onError={handleFaviconError}
                                        />
                                        <span>{`${item.hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")} · ${index + 1}`}</span>
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
