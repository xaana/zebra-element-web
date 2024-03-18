import { cn } from '@/lib/utils'

import React from 'react'

export const DropdownCategoryTitle = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className='text-[.65rem] font-semibold mb-1 uppercase text-neutral-500 dark:text-neutral-400 px-1.5'>
      {children}
    </div>
  )
}

export const DropdownButton = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode
    isActive?: boolean
    onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
    disabled?: boolean
    className?: string
  }
>(
  (
    { children, isActive, onClick, disabled, className },
    ref // This is the ref that will be forwarded
  ) => {
    const buttonClass = cn(
      'flex items-center gap-2 p-1.5 text-sm font-medium text-neutral-500 dark:text-neutral-400 text-left bg-transparent w-full rounded',
      !isActive && !disabled,
      'hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200',
      isActive &&
        !disabled &&
        'bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
      disabled && 'text-neutral-400 cursor-not-allowed dark:text-neutral-600',
      className
    )

    // Handling the click only if not disabled
    const handleClick = (event: React.MouseEvent | React.KeyboardEvent) => {
      if (!disabled && onClick) {
        onClick(event)
      }
    }

    return (
      <div
        ref={ref}
        className={buttonClass}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={handleClick}
        tabIndex={0} // Make the div focusable
        role='button' // ARIA role for accessibility
        // eslint-disable-next-line react/jsx-no-bind
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e)
          }
        }} // Optional: handle keydown for accessibility
      >
        {children}
      </div>
    )
  }
)

// Ensure to display a proper name in DevTools
DropdownButton.displayName = 'DropdownButton'
