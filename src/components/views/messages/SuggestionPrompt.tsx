import React, { useContext, useEffect } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { IContent } from "matrix-js-sdk/src/matrix";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { Separator } from "@/components/ui/separator";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

export const SuggestionPrompt = ({
    suggestions,
    rootId,
    roomId,
    type,
}: {
    suggestions: string[];
    rootId?: string;
    roomId: string;
    type?: any[] | string | boolean;
}) => {
    const client = useContext(MatrixClientContext);
    const [clicked, setClicked] = React.useState(false);
    const [model, setModel] = React.useState("");
    useEffect(() => {
        getCurrentSetting()
    },[])
    const getCurrentSetting = async() => {
        const model = await SettingsStore.getValue("LLMModel");
        setModel(model);
    }
    // if (!suggestions){
    //   return(
    //     <div className='space-y-2 mt-2'>
    //       <Skeleton className="w-auto h-7 rounded-md" />
    //       <Skeleton className="w-auto h-7 rounded-md" />
    //       <Skeleton className="w-auto h-7 rounded-md" />
    //     </div>
    //   )
    // }
    if (clicked)return null
    if (!suggestions || suggestions.length === 0) return null;
    return (
        <div className="space-y-2 mt-2">
            <Separator />
            <div className="flex flex-row items-center">
                <MessageCircleQuestion />
                <div className="text-base font-bold m-2">Related:</div>
            </div>
            {suggestions.map((suggestion, index) => {
                return (
                    <div
                        className="suggest-button text-xs p-1 border rounded-md cursor-pointer flex items-center gap-1"
                        onClick={async () => {
                            setClicked(true)
                            const content = { msgtype: "m.text", body: suggestion } as IContent;
                            if (model){
                                content.model = model
                            }
                            if (Array.isArray(type) && type.length > 0) {
                                content.fileSelected = type;
                                content.forceDoc = true;
                            } else if (typeof type === "string") {
                                content.database = type;
                                content.forceDatabase = true
                            } else if (typeof type === "boolean") {
                                content.web = type;
                            }
                            await client.sendMessage(roomId, rootId, content);
                        }}
                        key={suggestion}
                    >
                        <span>
                            {`${index + 1}. `}
                            {suggestion}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
