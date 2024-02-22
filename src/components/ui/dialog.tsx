import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'

import { cn } from '../../lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'zexa-fixed zexa-inset-0 zexa-z-50 zexa-bg-background/80 zexa-backdrop-blur-sm data-[state=open]:zexa-animate-in data-[state=closed]:zexa-animate-out data-[state=closed]:zexa-fade-out-0 data-[state=open]:zexa-fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <>
    {/* <DialogPortal> */}
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'zexa-fixed zexa-left-[50%] zexa-top-[50%] zexa-z-50 zexa-grid zexa-w-full zexa-max-w-lg -zexa-translate-x-1/2 -zexa-translate-y-1/2 zexa-gap-4 zexa-border zexa-bg-background zexa-p-6 zexa-shadow-lg zexa-duration-200 data-[state=open]:zexa-animate-in data-[state=closed]:zexa-animate-out data-[state=closed]:zexa-fade-out-0 data-[state=open]:zexa-fade-in-0 data-[state=closed]:zexa-zoom-out-95 data-[state=open]:zexa-zoom-in-95 data-[state=closed]:zexa-slide-out-to-left-1/2 data-[state=closed]:zexa-slide-out-to-top-[48%] data-[state=open]:zexa-slide-in-from-left-1/2 data-[state=open]:zexa-slide-in-from-top-[48%] sm:zexa-rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="zexa-absolute zexa-right-4 zexa-top-4 zexa-rounded-sm zexa-opacity-70 zexa-ring-offset-background zexa-transition-opacity hover:zexa-opacity-100 focus:zexa-outline-none focus:zexa-ring-2 focus:zexa-ring-ring focus:zexa-ring-offset-2 disabled:zexa-pointer-events-none data-[state=open]:zexa-bg-accent data-[state=open]:zexa-text-muted-foreground zexa-z-[4]">
        <Cross2Icon className="zexa-h-4 zexa-w-4" />
        <span className="zexa-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
    {/* </DialogPortal> */}
  </>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'zexa-flex zexa-flex-col zexa-space-y-1.5 zexa-text-center sm:zexa-text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'zexa-flex zexa-flex-col-reverse sm:zexa-flex-row sm:zexa-justify-end sm:zexa-space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'zexa-text-lg zexa-font-semibold zexa-leading-none zexa-tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('zexa-text-sm zexa-text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
}
