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
    <div className='zexa-bg-muted zexa-rounded-md zexa-shadow-none'>
      <Accordion type="single" collapsible className='zexa-shadow-none'>
        <AccordionItem value="item-1" className='zexa-shadow-none'>
          <AccordionTrigger className="!zexa-py-1 zexa-font-normal zexa-rounded-md zexa-bg-transparent zexa-shadow-none">
            {title}
          </AccordionTrigger>
          <AccordionContent className="zexa-overflow-auto zexa-px-0 zexa-font-mono zexa-shadow-none">
            {contents}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
