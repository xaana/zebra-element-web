import React, { useContext } from 'react'
import { IContent } from 'matrix-js-sdk/src/matrix'
import MatrixClientContext from 'matrix-react-sdk/src/contexts/MatrixClientContext'

import { Separator } from '@/components/ui/separator'


  export const SuggestionPrompt = ({ suggestions,rootId,roomId,type}: { suggestions: string[], rootId?: string, roomId: string,type?: any[] | string|boolean}) => {
    const client = useContext(MatrixClientContext)

    // if (!suggestions){
    //   return(
    //     <div className='space-y-2 mt-2'>
    //       <Skeleton className="w-auto h-7 rounded-md" />
    //       <Skeleton className="w-auto h-7 rounded-md" />
    //       <Skeleton className="w-auto h-7 rounded-md" />
    //     </div>
    //   )
    // }



    if (!suggestions || suggestions.length===0)return null;
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
                onClick={async ()=>{
                  const content = { msgtype: "m.text", body: suggestion } as IContent;
                  if(Array.isArray(type)&&type.length>0){
                    content.fileSelected = type
                  }else if (typeof type === 'string'){
                    content.database = type
                  }
                  else if (typeof type === 'boolean'){
                    content.web=type
                  }
                  await client.sendMessage(roomId, rootId, content);
                }}
                key={suggestion}
        >
            <span>{`${index+1}. `}{suggestion}</span>
        </div>
        )
      })}
        
      </div>
    )
  }
  