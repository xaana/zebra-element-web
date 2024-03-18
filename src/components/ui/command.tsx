import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Command as CommandPrimitive } from 'cmdk'

import { cn } from '../../lib/utils'
import { Dialog, DialogContent } from './dialog'

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'zexa-flex zexa-h-full zexa-w-full zexa-flex-col zexa-overflow-hidden zexa-rounded-md zexa-bg-popover zexa-text-popover-foreground',
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="zexa-overflow-hidden zexa-p-0">
        <Command className="[&_[cmdk-group-heading]]:zexa-px-2 [&_[cmdk-group-heading]]:zexa-font-medium [&_[cmdk-group-heading]]:zexa-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:zexa-pt-0 [&_[cmdk-group]]:zexa-px-2 [&_[cmdk-input-wrapper]_svg]:zexa-h-5 [&_[cmdk-input-wrapper]_svg]:zexa-w-5 [&_[cmdk-input]]:zexa-h-12 [&_[cmdk-item]]:zexa-px-2 [&_[cmdk-item]]:zexa-py-3 [&_[cmdk-item]_svg]:zexa-h-5 [&_[cmdk-item]_svg]:zexa-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="zexa-flex zexa-items-center zexa-border-b zexa-px-3"
    cmdk-input-wrapper=""
  >
    <MagnifyingGlassIcon className="zexa-mr-2 zexa-h-4 zexa-w-4 zexa-shrink-0 zexa-opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'zexa-flex zexa-h-10 zexa-w-full zexa-rounded-md zexa-bg-transparent zexa-py-3 zexa-text-sm zexa-outline-none placeholder:zexa-text-muted-foreground disabled:zexa-cursor-not-allowed disabled:zexa-opacity-50',
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'zexa-max-h-[300px] zexa-overflow-y-auto zexa-overflow-x-hidden',
      className
    )}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="zexa-py-6 zexa-text-center zexa-text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'zexa-overflow-hidden zexa-p-1 zexa-text-foreground [&_[cmdk-group-heading]]:zexa-px-2 [&_[cmdk-group-heading]]:zexa-py-1.5 [&_[cmdk-group-heading]]:zexa-text-xs [&_[cmdk-group-heading]]:zexa-font-medium [&_[cmdk-group-heading]]:zexa-text-muted-foreground',
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-zexa-mx-1 zexa-h-px zexa-bg-border', className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'zexa-relative zexa-flex zexa-cursor-default zexa-select-none zexa-items-center zexa-rounded-sm zexa-px-2 zexa-py-1.5 zexa-text-sm zexa-outline-none aria-selected:zexa-bg-accent aria-selected:zexa-text-accent-foreground data-[disabled]:zexa-pointer-events-none data-[disabled]:zexa-opacity-50',
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'zexa-ml-auto zexa-text-xs zexa-tracking-widest zexa-text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = 'CommandShortcut'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
}
