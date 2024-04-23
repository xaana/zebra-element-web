import React from 'react'

import { Separator } from '@/components/ui/separator'


  export const SuggestionPrompt = ({ suggestions,insertSuggestion }: { suggestions: string[], insertSuggestion: (suggestion: string) => void }) => {
    if (!suggestions||suggestions.length===0) return null
    return (
      
      <div className='space-y-2 mt-2'>
        <Separator />
        <div className="text-sm text-muted-foreground font-bold">
            Related:
        </div>
      {suggestions.map((suggestion,index)=>{
        return(
            <div
                className="text-xs text-muted-foreground p-1 border rounded-md cursor-pointer flex items-center gap-1 hover:bg-blue-100"
                onClick={()=>insertSuggestion(suggestion)}
                key={suggestion}
        >
            <span>{`${index+1}. `}{suggestion}</span>
        </div>
        )
      })}
        
      </div>
    )
  }
  