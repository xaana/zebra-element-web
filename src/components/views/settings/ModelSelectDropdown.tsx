import React, { useContext } from "react";
// import { Room, MatrixEvent } from "matrix-js-sdk/src/matrix";
import { ChevronsUpDown  } from "lucide-react";

import { cn } from "../../../lib/utils"
import { RadioGroup, RadioGroupItem } from "../../ui/RadioGroup";
import { Label } from "../../ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../ui/popover" ;
import { Button } from "../../ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { SettingLevel } from "matrix-react-sdk/src/settings/SettingLevel";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";

export const ModelSelectDropdown = (): React.JSX.Element => {
    const [currModel, setCurrModel] = React.useState("");
    const [models, setModels]= React.useState<string[]>([]);
    const client = useContext(MatrixClientContext);

    React.useEffect(()=>{
        //TODO
        fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/llm_mgmt/get_model/user_id=${client.getUserId()}`, {
            method: 'GET', // GET is the default method, so this is optional
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res)=>res.json()
        ).then((data)=>{
            if(Array.isArray(data))setModels(data);
        });
        getCurrentSetting();
    },[]);
    const getCurrentSetting = async() => {
        const model = await SettingsStore.getValue("LLMModel");
        setCurrModel(model);
    }

    const radioValueChangeHandler = async (updatedValue: string) => {
        await SettingsStore.setValue("LLMModel", null, SettingLevel.ACCOUNT, updatedValue);
        setCurrModel(updatedValue)
    }
    return (
        <div className="flex flex-row items-center space-x-4">
            <span className="mr-2">Language Models:</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[240px]">{currModel
                        ? currModel
                        : "Choose Model..."}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup value={currModel} onValueChange={radioValueChangeHandler}>
                        {models.map((item) => (
                            <DropdownMenuRadioItem value={item}>{item}</DropdownMenuRadioItem>
                        ))}
                        </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
}

export default ModelSelectDropdown;