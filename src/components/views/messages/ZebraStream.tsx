import React, { useState, useEffect } from 'react';
import * as HtmlUtils from "matrix-react-sdk/src/HtmlUtils";
import SettingsStore from 'matrix-react-sdk/src/settings/SettingsStore';
import { WebSearchSourceItem, WebSearchSources } from '@/components/web/WebSearchSources';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell } from 'lucide-react';
import { DocFile } from '../rooms/FileSelector';
import { IContent } from 'matrix-js-sdk/src/matrix';

interface IProps {
  roomId?: string;
  eventId?: string;
  rawQuestion?: string;
  content: IContent
}

const ZebraStream: React.FC<IProps> = ({ roomId, eventId,rawQuestion,content }) => { 
    const [markdown, setMarkdown] = useState("");
    const [webSource, setWebSource] = useState<WebSearchSourceItem[]>([]);
    useEffect(() => {
        

        if(content.type === "web")fetchWebStream();
        if (content.type === "pdf")fetchPdfStream();

        return () => {
            // Cleanup logic if needed, e.g., aborting the fetch
        };

    }, []);
    const fetchWebStream = async () => {
        try {
            const payload = {
                roomId: roomId,
                firstMessageEventId: eventId,
                question: rawQuestion,
                eventId:content.questionId,
                
            };
            const url = `${SettingsStore.getValue("botApiUrl")}/web_stream`;
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            
            // Check if response.body is not null
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let firstChunk = true;
                const readStream = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }
                    // Decode the stream chunk to text
                    const chunk = decoder.decode(value, { stream: true });
                    // console.log("Stream chunk:", JSON.parse(chunk));
                    if (firstChunk) {
                        firstChunk = false;
                        const webCitations: WebSearchSourceItem[] = JSON.parse(chunk).source_links.map((item: string) => {
                            const url = new URL(item);
                            return {
                                link: item,
                                hostname: url.hostname,
                            };
                        });
                        if(JSON.parse(chunk).content) {setMarkdown(JSON.parse(chunk).content);}
                        setWebSource(webCitations);
                    }else{
                        setMarkdown(chunk);
                    }
                    

                    // Read the next chunk
                    await readStream();
                };

                await readStream();
            } else {
                console.error('Response body is null.');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    const fetchPdfStream = async () => {
        try {
            const payload = {
                roomId: roomId,
                firstMessageEventId: eventId,
                question: rawQuestion,
                eventId:content.questionId,
                mediaIds: content.fileSelected,
                webFlag: content.webFlag,
                pdfSummary: content.pdfSummary
                
            };
            const url = `${SettingsStore.getValue("botApiUrl")}/pdf_query_stream`;
            const request = new Request(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const response = await fetch(request);
            
            // Check if response.body is not null
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                const readStream = async () => {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }
                    // Decode the stream chunk to text
                    const chunk = decoder.decode(value, { stream: true });
                    // console.log("Stream chunk:", JSON.parse(chunk));
                    setMarkdown(chunk);
                    // Read the next chunk
                    await readStream();
                };

                await readStream();
            } else {
                console.error('Response body is null.');
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    const getSectionTitle = (title: string, Icon: React.FC | null): React.ReactNode => {
        return (
            <div className="flex flex-row items-center">
                {Icon && <Icon />}
                <div className="text-base font-bold m-2">{title}:</div>
            </div>
        );
    }

    if(!content.fetching) return null
    if (markdown === "") return (<div>Thinking...</div>)

    return (
        <div>
            <div className="p-4">
                    <h2>
                        <strong>{rawQuestion}</strong>
                    </h2>
                    {webSource ? (
                        <WebSearchSources data={webSource} />
                    ) : (
                        <Skeleton className="w-full h-[30px] rounded-full" />
                    )}
                    <Separator />
                    {getSectionTitle("Answer", Bell)}
                    {HtmlUtils.bodyToHtml({format: "org.matrix.custom.html", formatted_body: markdown},[],{})}
            </div>
            
        </div>
    )
}

// Export the component
export default ZebraStream;
