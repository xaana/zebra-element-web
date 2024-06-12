import React, { useState, useEffect } from 'react';
import * as HtmlUtils from "matrix-react-sdk/src/HtmlUtils";
import { IContent } from 'matrix-js-sdk/src/matrix';
import SettingsStore from 'matrix-react-sdk/src/settings/SettingsStore';
import parse from 'html-react-parser';

interface IProps {
  fetching?: boolean;
  roomId?: string;
  eventId?: string;
  type?: string;
  rawQuestion?: string;
  questionId?: string;
}

const ZebraStream: React.FC<IProps> = ({ fetching, roomId, eventId, type,rawQuestion,questionId }) => { 
    const [markdown, setMarkdown] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = {
                    roomId: roomId,
                    firstMessageEventId: eventId,
                    question: rawQuestion,
                    eventId:questionId,
                    
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

                    const readStream = async () => {
                        const { done, value } = await reader.read();
                        if (done) {
                            console.log("Stream complete");
                            return;
                        }
                        // Decode the stream chunk to text
                        const chunk = decoder.decode(value, { stream: true });
                        console.log("Stream chunk:", chunk);
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
        };

        fetchData();

        return () => {
            // Cleanup logic if needed, e.g., aborting the fetch
        };

    }, []);
    if(!fetching) return null
    // const content:IContent = {
    //     format: "org.matrix.custom.html",
    //     formatted_body: markdown,
    // }
    // const body = HtmlUtils.bodyToHtml({format: "org.matrix.custom.html", formatted_body: markdown},[],{})
    return (
        <div>
            {HtmlUtils.bodyToHtml({format: "org.matrix.custom.html", formatted_body: markdown},[],{})}
        </div>
    );
}

// Export the component
export default ZebraStream;
