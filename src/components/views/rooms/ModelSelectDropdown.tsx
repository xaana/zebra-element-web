import React from "react";
import { Room, MatrixEvent } from "matrix-js-sdk/src/matrix";
import { Check, ChevronsUpDown  } from "lucide-react";

import { cn } from "../../../lib/utils"
import { RadioGroup, RadioGroupItem } from "../../ui/RadioGroup";
import { Label } from "../../ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../ui/popover" ;
import { Button } from "../../ui/button";

export const ModelSelectDropdown = (): React.JSX.Element => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [currModel, setCurrModel] = React.useState("");
    const [models, setModels]= React.useState([]);

    React.useEffect(()=>{
        //TODO
        setModels([
            {
                id: "gpt-4",
                name: "OpenAI GPT-4"
            },
            {
                id: "zebra-llm",
                name: "Zebra LLM"
            }
        ])
    },[]);

    const radioValueChangeHandler = (updatedValue: string) => {
        setCurrModel(updatedValue)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-7 w-[160px] justify-between text-sm"
                >
                    {currModel
                        ? currModel.name
                        : "Choose Model..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[160px] p-0">
                <RadioGroup onValueChange={radioValueChangeHandler}>
                    { models.map((item,index)=>{
                            return (
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                        value={item.id}
                                        id={""+index}
                                    />
                                    <Label htmlFor="r1">{item.name}</Label>
                                </div>
                            )
                        })
                        
                    }
                
                {/* <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Comfortable</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Compact</Label>
                </div> */}
                </RadioGroup>
            </PopoverContent>
        </Popover>
    )
}

export default ModelSelectDropdown;