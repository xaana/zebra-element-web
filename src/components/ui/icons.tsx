import { cn } from '../../lib/utils'
import * as React from 'react'

export function IconChartDonut({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        style={{height: '1rem',width: '1rem',marginRight: '0.5rem'}}
        viewBox="0 0 256 256"
        {...props}
      >
        <path d="M137.39,24.06A16,16,0,0,0,120,40V80.67a15.86,15.86,0,0,0,13.25,15.76A32,32,0,1,1,96,129.68c-.41-8.22,1.27-15,5-20.26h0a15.86,15.86,0,0,0-1.69-20.47L71.69,60.68a16,16,0,0,0-23.63,1.1A103.6,103.6,0,0,0,55,202.05,103.24,103.24,0,0,0,128,232h1.49A104.3,104.3,0,0,0,232,129.48C232.75,75.18,191.19,28.88,137.39,24.06ZM60.32,71.94l27.61,28.19,0,.06A43.29,43.29,0,0,0,80.44,120H40.36A87.13,87.13,0,0,1,60.32,71.94ZM40.37,136h40.3A48,48,0,0,0,120,175.34v40.3A88,88,0,0,1,40.37,136Zm149.77,54.14A87.45,87.45,0,0,1,136,215.61V175.34a47.55,47.55,0,0,0,24.73-12.23A48,48,0,0,0,136,80.66L136,40c45.52,4.08,80.67,43.28,80,89.25A87.45,87.45,0,0,1,190.14,190.14Z"></path>
      </svg>
    )
  }

export function IconZoomIn({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={cn('zexa-h-4 zexa-w-4', className)}
        viewBox="0 0 256 256"
        {...props}
      >
        <path d="M152,112a8,8,0,0,1-8,8H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"></path>
      </svg>
    )
  }
export function IconZoomOut({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className={cn('zexa-h-4 zexa-w-4', className)}
        viewBox="0 0 256 256"
        {...props}
      >
        <path d="M152,112a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h64A8,8,0,0,1,152,112Zm77.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88.11,88.11,0,1,1,11.31-11.31l50.07,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"></path>
      </svg>
    )
  }