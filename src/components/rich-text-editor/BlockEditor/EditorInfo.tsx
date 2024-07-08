import React from "react";
import { memo } from "react";

// import { EditorUser } from "./types";

// import { EditorContext } from "@/components/rich-text-editor/context/EditorContext";
// import Tooltip from "@/components/ui/TooltipAlt";
// import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export type EditorInfoProps = {
    characters: number;
    words: number;
};

export const EditorInfo = memo(({ characters, words }: EditorInfoProps) => {
    return (
        <div className="flex items-center">
            <div className="flex flex-col justify-center">
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {words} {words === 1 ? "word" : "words"}
                </div>
                <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {characters} {characters === 1 ? "character" : "characters"}
                </div>
            </div>
            <Separator orientation="vertical" className="w-[1px] h-10 bg-muted mx-4 my-0" />
            {/* <div className="flex items-center gap-2 mr-2">
                <div
                    className={cn("w-2 h-2 rounded-full", {
                        "bg-yellow-500 dark:bg-yellow-400": collabState === "connecting",
                        "bg-green-500 dark:bg-green-400": collabState === "connected",
                        "bg-red-500 dark:bg-red-400": collabState === "disconnected",
                    })}
                />
                <span className="max-w-[4rem] text-xs text-neutral-500 dark:text-neutral-400 font-semibold">
                    {getConnectionText(collabState)}
                </span>
            </div> */}
            {/* {collabState === "connected" && (
                <div className="flex flex-row items-center">
                    <div className="relative flex flex-row items-center ml-3">
                        {users.slice(0, 3).map((user: EditorUser) => (
                            <div key={user.clientId} className="-ml-3">
                                <Tooltip title={user.name}>
                                    <img
                                        className="w-8 h-8 border border-white rounded-full dark:border-black"
                                        src={`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${
                                            user.name
                                        }&backgroundColor=${user.color?.replace("#", "")}`}
                                        alt="avatar"
                                    />
                                </Tooltip>
                            </div>
                        ))}
                        {users.length > 3 && (
                            <div className="-ml-3">
                                <div className="flex items-center justify-center w-8 h-8 font-bold text-xs leading-none border border-white dark:border-black bg-[#FFA2A2] rounded-full">
                                    +{users.length - 3}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
});

EditorInfo.displayName = "EditorInfo";
