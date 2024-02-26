import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = ({
  className,
  ...props
}: SheetPrimitive.DialogPortalProps) => (

  <SheetPrimitive.Portal className={cn(className)} {...props} />
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'zexa-fixed zexa-inset-0 zexa-z-50 zexa-bg-background/80 zexa-backdrop-blur-sm data-[state=open]:zexa-animate-in data-[state=closed]:zexa-animate-out data-[state=closed]:zexa-fade-out-0 data-[state=open]:zexa-fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  'zexa-fixed zexa-z-50 zexa-gap-4 zexa-bg-background zexa-p-6 zexa-shadow-lg zexa-transition zexa-ease-in-out data-[state=open]:zexa-animate-in data-[state=closed]:zexa-animate-out data-[state=closed]:zexa-duration-300 data-[state=open]:zexa-duration-500',
  {
    variants: {
      side: {
        top: 'zexa-inset-x-0 zexa-top-0 zexa-border-b data-[state=closed]:zexa-slide-out-to-top data-[state=open]:zexa-slide-in-from-top',
        bottom:
          'zexa-inset-x-0 zexa-bottom-0 zexa-border-t data-[state=closed]:zexa-slide-out-to-bottom data-[state=open]:zexa-slide-in-from-bottom',
        left: 'zexa-inset-y-0 zexa-left-0 zexa-h-full zexa-w-3/4 zexa-border-r data-[state=closed]:zexa-slide-out-to-left data-[state=open]:zexa-slide-in-from-left sm:zexa-max-w-sm',
        right:
          'zexa-inset-y-0 zexa-right-0 zexa-h-full zexa-w-3/4 zexa-border-l data-[state=closed]:zexa-slide-out-to-right data-[state=open]:zexa-slide-in-from-right sm:zexa-max-w-sm'
      }
    },
    defaultVariants: {
      side: 'right'
    }
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showClose?: boolean
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    { side = 'right', className, children, showClose = true, ...props },
    ref
  ) => (
    <>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        {showClose && (
          <SheetPrimitive.Close className="zexa-absolute zexa-right-4 zexa-top-4 zexa-rounded-sm zexa-opacity-70 zexa-ring-offset-background zexa-transition-opacity hover:zexa-opacity-100 focus:zexa-outline-none focus:zexa-ring-2 focus:zexa-ring-ring focus:zexa-ring-offset-2 disabled:zexa-pointer-events-none data-[state=open]:zexa-bg-secondary">
            <Cross2Icon className="zexa-h-4 zexa-w-4" />
            <span className="zexa-sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </>
  )
)
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'zexa-flex zexa-flex-col zexa-space-y-2 zexa-text-center sm:zexa-text-left',
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = 'SheetHeader'

const SheetFooter = ({
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
SheetFooter.displayName = 'SheetFooter'

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      'zexa-text-lg zexa-font-semibold zexa-text-foreground',
      className
    )}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('zexa-text-sm zexa-text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
}
