import * as React from "react"
 
import { cn } from "../../lib/utils"
 
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
 
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "zexa-flex zexa-h-9 zexa-w-full zexa-rounded-md zexa-border zexa-border-input zexa-bg-transparent zexa-px-3 zexa-py-1 zexa-text-sm zexa-shadow-sm zexa-transition-colors file:zexa-border-0 file:zexa-bg-transparent file:zexa-text-sm file:zexa-font-medium placeholder:zexa-text-muted-foreground focus-visible:zexa-outline-none focus-visible:zexa-ring-1 focus-visible:zexa-ring-ring disabled:zexa-cursor-not-allowed disabled:zexa-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
 
export { Input }