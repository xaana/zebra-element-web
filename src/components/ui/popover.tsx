import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '../../lib/utils'

const Popover = PopoverPrimitive.Root

const PopoverPortal = PopoverPrimitive.Portal

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      className,
      'zexa-z-50 zexa-w-72 zexa-rounded-md zexa-border zexa-bg-popover zexa-p-4 zexa-text-popover-foreground zexa-shadow-md zexa-outline-none data-[state=open]:zexa-animate-in data-[state=closed]:zexa-animate-out data-[state=closed]:zexa-fade-out-0 data-[state=open]:zexa-fade-in-0 data-[state=closed]:zexa-zoom-out-95 data-[state=open]:zexa-zoom-in-95 data-[side=bottom]:zexa-slide-in-from-top-2 data-[side=left]:zexa-slide-in-from-right-2 data-[side=right]:zexa-slide-in-from-left-2 data-[side=top]:zexa-slide-in-from-bottom-2'
    )}
    {...props}
  />
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverPortal, PopoverTrigger, PopoverContent }
