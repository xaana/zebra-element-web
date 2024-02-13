import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRightIcon } from '@radix-ui/react-icons'

import { cn } from '../../lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('', className)} {...props} />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="zexa-flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'AccordionTrigger zexa-flex zexa-flex-1 zexa-items-center zexa-justify-between zexa-py-4 zexa-text-sm zexa-font-medium zexa-transition-all hover:zexa-underline [&[data-state=open]>svg]:zexa-rotate-180',
        className
      )}
      {...props}
    >
      {children}
      {!props.disabled && (
        <ChevronRightIcon
          className="AccordionChevron zexa-h-4 zexa-w-4 zexa-shrink-0 zexa-text-muted-foreground zexa-transition-transform zexa-duration-200"
          aria-hidden
        />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="zexa-overflow-hidden zexa-text-sm data-[state=closed]:zexa-animate-accordion-up data-[state=open]:zexa-animate-accordion-down"
    {...props}
  >
    <div className={cn('zexa-pb-4 zexa-pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
