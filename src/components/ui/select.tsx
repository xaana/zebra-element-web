import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import * as SelectPrimitive from '@radix-ui/react-select'

import { cn } from '../../lib/utils'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'zexa-flex zexa-h-9 zexa-w-full zexa-items-center zexa-justify-between zexa-rounded-md zexa-border zexa-border-input zexa-bg-transparent zexa-px-3 zexa-py-2 zexa-text-sm zexa-shadow-sm zexa-ring-offset-background placeholder:zexa-text-muted-foreground focus:zexa-outline-none focus:zexa-ring-1 focus:zexa-ring-ring disabled:zexa-cursor-not-allowed disabled:zexa-opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="zexa-h-4 zexa-w-4 zexa-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  // <SelectPrimitive.Portal>
  <SelectPrimitive.Content
    ref={ref}
    className={cn(
      'zexa-relative zexa-z-50 zexa-min-w-[8rem] zexa-overflow-hidden zexa-rounded-md zexa-border zexa-bg-popover zexa-text-popover-foreground zexa-shadow-md data-[state=open]:zexa-animate-in data-[state=closed]:zexa-animate-out data-[state=closed]:zexa-fade-out-0 data-[state=open]:zexa-fade-in-0 data-[state=closed]:zexa-zoom-out-95 data-[state=open]:zexa-zoom-in-95 data-[side=bottom]:zexa-slide-in-from-top-2 data-[side=left]:zexa-slide-in-from-right-2 data-[side=right]:zexa-slide-in-from-left-2 data-[side=top]:zexa-slide-in-from-bottom-2',
      position === 'popper' &&
        'data-[side=bottom]:zexa-translate-y-1 data-[side=left]:zexa--translate-x-1 data-[side=right]:zexa-translate-x-1 data-[side=top]:zexa--translate-y-1',
      className
    )}
    position={position}
    {...props}
  >
    <SelectPrimitive.Viewport
      className={cn(
        'zexa-p-1',
        position === 'popper' &&
          'h-[var(--radix-select-trigger-height)] zexa-w-full zexa-min-w-[var(--radix-select-trigger-width)]'
      )}
    >
      {children}
    </SelectPrimitive.Viewport>
  </SelectPrimitive.Content>
  // </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'zexa-px-2 zexa-py-1.5 zexa-text-sm zexa-font-semibold',
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'zexa-relative zexa-flex zexa-w-full zexa-cursor-default zexa-select-none zexa-items-center zexa-rounded-sm zexa-py-1.5 zexa-pl-2 zexa-pr-8 zexa-text-sm zexa-outline-none focus:zexa-bg-accent focus:zexa-text-accent-foreground data-[disabled]:zexa-pointer-events-none data-[disabled]:zexa-opacity-50',
      className
    )}
    {...props}
  >
    <span className="zexa-absolute zexa-right-2 zexa-flex zexa-h-3.5 zexa-w-3.5 zexa-items-center zexa-justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="zexa-h-4 zexa-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('zexa--mx-1 zexa-my-1 zexa-h-px zexa-bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator
}
