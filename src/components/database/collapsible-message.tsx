import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
export function CollapsibleMessage({
  title,
  contents
}: {
  title: string
  contents: JSX.Element[]
}) {
  return (
    <div className='zexa-bg-muted zexa-rounded-md zexa-px-2'>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="!zexa-py-1 zexa-font-normal zexa-rounded-md zexa-bg-transparent">
            {title}
          </AccordionTrigger>
          <AccordionContent className="zexa-overflow-auto zexa-px-0 zexa-font-mono ">
            {contents}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
