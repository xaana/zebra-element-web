import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"


const buttonVariants = cva(
  'zexa-inline-flex zexa-items-center zexa-justify-center zexa-rounded-md zexa-text-sm zexa-font-normal zexa-transition-colors focus-visible:zexa-outline-none focus-visible:zexa-ring-1 focus-visible:zexa-ring-ring disabled:zexa-pointer-events-none disabled:zexa-opacity-50',
  {
    variants: {
      variant: {
        default:
          'zexa-bg-primary zexa-text-primary-foreground zexa-shadow hover:zexa-bg-primary/90',
        destructive:
          'zexa-bg-destructive zexa-text-destructive-foreground zexa-shadow-sm hover:zexa-bg-destructive/90',
        outline:
          'zexa-border zexa-border-input zexa-bg-transparent zexa-shadow-sm hover:zexa-bg-accent hover:zexa-text-accent-foreground',
        secondary:
          'zexa-bg-secondary zexa-text-secondary-foreground zexa-shadow-sm hover:zexa-bg-secondary/80',
        ghost: 'hover:zexa-bg-accent hover:zexa-text-accent-foreground',
        link: 'zexa-text-primary zexa-underline-offset-4 hover:zexa-underline'
      },
      size: {
        default: 'zexa-h-9 zexa-px-4 zexa-py-2',
        sm: 'zexa-h-8 zexa-rounded-md zexa-px-3 zexa-text-xs',
        lg: 'zexa-h-10 zexa-rounded-md zexa-px-8',
        icon: 'zexa-h-9 zexa-w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
