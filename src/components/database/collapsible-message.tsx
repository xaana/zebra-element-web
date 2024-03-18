import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
export function CollapsibleMessage({ title, contents }: { title: string; contents: JSX.Element[] }) {
    return (
        <div className="bg-muted rounded-md px-2">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="!py-1 font-normal rounded-md bg-transparent">{title}</AccordionTrigger>
                    <AccordionContent className="overflow-auto px-0 font-mono ">{contents}</AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
