import React from "react"
import { Column } from "@tanstack/react-table"
import { Filter as FilterIcon } from 'lucide-react';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";


const Filter = ({ column }: { column: Column<any, unknown> }):React.JSX.Element => {
    const { filterVariant } = column.columnDef.meta ?? {}
    const client = useMatrixClientContext()
    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = React.useMemo(
        () =>
            filterVariant === 'range'
            ? []
            : Array.from(column.getFacetedUniqueValues().keys())
                .sort()
                .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    )
    console.log(sortedUniqueValues,column)

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2 border-0 h-6">
            <DebouncedInput
                type="number"
                min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                value={(columnFilterValue as [number, number])?.[0] ?? ''}
                onChange={value =>
                column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                }
                placeholder={`Min ${
                column.getFacetedMinMaxValues()?.[0] !== undefined
                    ? `(${column.getFacetedMinMaxValues()?.[0]})`
                    : ''
                }`}
                className="w-24 border shadow rounded"
            />
            <DebouncedInput
                type="number"
                min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                value={(columnFilterValue as [number, number])?.[1] ?? ''}
                onChange={value =>
                column.setFilterValue((old: [number, number]) => [old?.[0], value])
                }
                placeholder={`Max ${
                column.getFacetedMinMaxValues()?.[1]
                    ? `(${column.getFacetedMinMaxValues()?.[1]})`
                    : ''
                }`}
                className="w-24 border shadow rounded"
            />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select
            className="rounded-sm border-2 border-[#666666] h-5"
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            <option value="">All</option>
            {sortedUniqueValues.map(value => {
                let showContent = ''
                if (column.id==="sender"){
                    showContent = value.split(":")[0].substring(1);
                }
                else if (column.id==="roomId"){
                    if(value==="None")showContent = "None"
                    else{
                        const room = client.getRoom(value);
                        showContent = room?.name ?? "Room Deleted";
                    }
                }
                else{
                    showContent = value
                }
                if (showContent.length > 30) {
                    showContent = showContent.substring(0, 19) + '...'
                }
                //dynamically generated select options from faceted values feature
                return (<option value={value} key={value} title={column.id!=="roomId"&&value}>
                    {showContent}
                </option>)
                
            })}
        </select>
    ) : filterVariant === 'input' ? (
      <>
        {/* Autocomplete suggestions from faceted values feature */}
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.map((value: any) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    ) : (
        <></>
    )
  }

const DebouncedInput = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
    }: {
        value: string | number
        onChange: (value: string | number) => void
        debounce?: number
    } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>):React.JSX.Element => {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

export const FilterWrapper = ({
    title,
    ...props
}) : React.JSX.Element => {
    return (
        <Popover>
            <PopoverTrigger>
                <FilterIcon className="w-3 h-3 mr-2" fill="#666666" />
            </PopoverTrigger>
            <PopoverContent>
                <span>Filtering on {title}</span>
                <div>
                    <Filter {...props} />
                </div>
            </PopoverContent>
        </Popover>
    )
}
