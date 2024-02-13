// import * as React from 'react'


// const Table = React.forwardRef<
//   HTMLTableElement,
//   React.HTMLAttributes<HTMLTableElement>
// >(({ className, ...props }, ref) => (
//   <div style={{width: '100%', overflow: 'auto'}}>
//     <table
//       ref={ref}
//       style={{width: '100%',captionSide: 'bottom', fontSize: '0.875rem',lineHeight: '1.25rem',borderCollapse: 'collapse'}}
//       {...props}
//     />
//   </div>
// ))
// Table.displayName = 'Table'

// const TableHeader = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <thead
//     ref={ref}
//     // style={{ borderCollapse: 'collapse', border: '1px solid black' }}
//     {...props}
//   />
// ))
// TableHeader.displayName = 'TableHeader'

// const TableBody = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tbody
//     ref={ref}
//     style={{fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}}
//     {...props}
//   />
// ))
// TableBody.displayName = 'TableBody'

// const TableFooter = React.forwardRef<
//   HTMLTableSectionElement,
//   React.HTMLAttributes<HTMLTableSectionElement>
// >(({ className, ...props }, ref) => (
//   <tfoot
//     ref={ref}
//     style=
//       {{backgroundColor: 'hsl(220.9 39.3% 11%)', fontWeight: '500', color: 'hsl(210 20% 98%)'}}
//     {...props}
//   />
// ))
// TableFooter.displayName = 'TableFooter'

// const TableRow = React.forwardRef<
//   HTMLTableRowElement,
//   React.HTMLAttributes<HTMLTableRowElement>
// >(({ className, ...props }, ref) => (
//   <tr
//     ref={ref}
//     style=
//       {{borderBottom: '1px solid #e2e8f0',transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
//       transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',transitionDuration: '150ms', borderBottomColor: 'currentColor'}}
//     // className={'zexa-border-b zexa-transition-colors hover:zexa-bg-muted/50 data-[state=selected]:zexa-bg-muted'}
//     {...props}
//   />
// ))
// TableRow.displayName = 'TableRow'

// const TableHead = React.forwardRef<
//   HTMLTableCellElement,
//   React.ThHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <th
//     ref={ref}
//     style=
//     // {{height: '2.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem', textAlign: 'left', verticalAlign: 'middle',fontWeight: '400'}}
//     {{height: '2.5rem',paddingLeft: '0.5rem',paddingRight: '0.5rem',
//     textAlign: 'left',verticalAlign: 'middle',fontWeight: '400',color: 'hsl(220 8.9% 46.1%)',borderBottom:'1px solid black'}}
//     {...props}
//   />
// ))
// TableHead.displayName = 'TableHead'

// const TableCell = React.forwardRef<
//   HTMLTableCellElement,
//   React.TdHTMLAttributes<HTMLTableCellElement>
// >(({ className, ...props }, ref) => (
//   <td
//     ref={ref}
//     style={{padding: '0.5rem', verticalAlign: 'middle', display: 'table-cell', fontWeight: '400',minWidth:className===undefined? undefined:'450px'}}
//     {...props}
//   />
// ))
// TableCell.displayName = 'TableCell'

// const TableCaption = React.forwardRef<
//   HTMLTableCaptionElement,
//   React.HTMLAttributes<HTMLTableCaptionElement>
// >(({ className, ...props }, ref) => (
//   <caption
//     ref={ref}
//     style=
// {{marginTop: '1rem', fontSize: '0.875rem',lineHeight: '1.25rem',color: 'hsl(220 8.9% 46.1%)'}}
//     {...props}
//   />
// ))
// TableCaption.displayName = 'TableCaption'

// export {
//   Table,
//   TableHeader,
//   TableBody,
//   TableFooter,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableCaption
// }
import * as React from 'react'
import { cn } from '../../lib/utils'


const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="zexa-w-full zexa-overflow-auto scrollbar--custom">
    <table
      ref={ref}
      className={cn('zexa-w-full zexa-caption-bottom zexa-text-sm border-collapse', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:zexa-border-b zexa-border-solid', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:zexa-border-0 zexa-border-solid', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'zexa-bg-primary zexa-font-medium zexa-text-primary-foreground',
      className
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'zexa-border-b zexa-gray-200 zexa-transition-colors hover:zexa-bg-muted/50 data-[state=selected]:zexa-bg-muted',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'zexa-h-10 zexa-border-0 zexa-border-b zexa-border-solid zexa-px-2 zexa-text-left zexa-align-middle zexa-font-medium zexa-text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    // style={{borderBottom: '1px solid #e2e8f0'}}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'zexa-p-2 zexa-border-0 zexa-border-b zexa-border-solid zexa-align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    // style={{borderBottom: '1px solid #e2e8f0'}}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      'zexa-mt-4 zexa-text-sm zexa-text-muted-foreground',
      className
    )}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
}

