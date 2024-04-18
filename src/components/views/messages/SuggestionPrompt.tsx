import React from 'react'

  export const SuggestionPrompt = ({ suggestions,insertSuggestion }: { suggestions: string[], insertSuggestion: (suggestion: string) => void }) => {
    return (
      <div className='space-y-2'>
      {suggestions.map((suggestion,index)=>{
        return(
            <div
                className="text-xs text-muted-foreground p-1 border rounded-md cursor-pointer flex items-center gap-1 hover:bg-blue-100"
                onClick={()=>insertSuggestion(suggestion)}
        >
            <span>{`${index+1}. `}{suggestion}</span>
        </div>
        )
      })}
        
      </div>
    )
  }
  