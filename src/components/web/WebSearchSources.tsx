import React from 'react'

import { Tooltip, TooltipTrigger } from '../ui/tooltip-alt'

  export type WebSearchSourceItem = {
    // title: string
    link: string
    hostname: string
  }
  export const WebSearchSources = ({ data }: { data: WebSearchSourceItem[] }) => {
    return (
      <>
        {data && data.length > 0 && (
          <div className="flex gap-2 mt-4 items-center flex-wrap">
            <div className="text-sm text-muted-foreground font-bold">
              Sources:
            </div>
            {data.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground p-1 border rounded-md cursor-pointer flex items-center gap-1"
                  >
                    <img
                      // src={`https://${item.hostname}/favicon.ico`}
                      src={`https://www.google.com/s2/favicons?sz=64&domain_url=${item.hostname}`}
                      alt="Favicon"
                      className="h-4 w-4"
                      // onError={handleFaviconError}
                    />
                    <span>
                      {item.hostname.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')}
                    </span>
                  </a>
                </TooltipTrigger>
                {/* <TooltipContent>{item.title}</TooltipContent> */}
              </Tooltip>
            ))}
          </div>
        )}
      </>
    )
  }
  