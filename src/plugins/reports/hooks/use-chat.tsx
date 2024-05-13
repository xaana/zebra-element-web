import React, { useRef, useState, useMemo } from "react";

import type { Message } from "@/plugins/reports/types";

import { MessageLoader } from "@/components/reports/Chat/message-loader";
import SuggestedPrompts from "@/components/reports/Chat/suggested-prompts";

const initialMessage: Message = {
    id: "0",
    role: "system",
    content: `👋 Hi, I'm your AI writing partner. Click on a section and then type below to have me change it.`,
    children: <SuggestedPrompts />,
};

export type Chat = {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    lastSystemMessageId: React.MutableRefObject<string | null>;
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    processStream: (
        reader: ReadableStreamDefaultReader<any>,
        onComplete?: Function,
        chatMessageId?: string,
        children?: React.ReactNode,
        messageActions?: boolean,
        loader?: boolean,
        abortSignal?: AbortSignal,
        newMessage?: boolean,
    ) => void;
    appendMessage: (
        content: string,
        role: "system" | "user",
        loader: boolean,
        children: React.ReactNode,
        streaming: boolean,
        messageActions: boolean,
        newMessage: boolean,
        abortSignal?: AbortSignal,
    ) => void;
    reset: () => void;
};

/**
 * Custom hook that manages chat functionality.
 *
 * @param {Object} options - The options object.
 * @param {Array<Message>} options.initialMessages - The initial messages.
 * @return {Object} - An object containing the chat state and handlers.
 */
export function useChat({
    initialMessages,
    isOpen,
    open,
    close,
    toggle,
}: {
    initialMessages?: Message[];
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}): Chat {
    // Input state and handlers.
    const [messages, setMessages] = useState<Message[]>(initialMessages || [initialMessage]);
    const [isLoading, setIsLoading] = useState(false);
    const lastSystemMessageId = useRef<string | null>(null);
    // Memoized TextDecoder to avoid unnecessary re-creations
    const decoder = useMemo(() => new TextDecoder(), []);
    const isStreaming = useRef<boolean>(false);
    let responseBuffer = "";
    const streamQueue = useRef<
        Array<{
            reader: ReadableStreamDefaultReader<any>;
            setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
            onComplete?: Function;
            chatMessageId?: string;
            children?: React.ReactNode;
            messageActions?: boolean;
            loader?: boolean;
            abortSignal?: AbortSignal;
            newMessage?: boolean;
        }>
    >([]); // Queue to hold pending streams
    function simulateReadableStream(text: string, chunkSize = 10, framesPerChunk = 5): ReadableStream<Uint8Array> {
        let currentIndex = 0;
        let frameCount = 0;

        return new ReadableStream({
            start(controller): void {
                const pushTextChunk = (): void => {
                    if (frameCount === framesPerChunk) {
                        if (currentIndex < text.length) {
                            const chunk = text.slice(currentIndex, currentIndex + chunkSize);
                            controller.enqueue(new TextEncoder().encode(chunk));
                            currentIndex += chunkSize;
                        } else {
                            controller.close();
                            return;
                        }
                        frameCount = 0;
                    }

                    frameCount++;
                    requestAnimationFrame(pushTextChunk);
                };

                requestAnimationFrame(pushTextChunk);
            },
        });
    }

    const appendMessage = async (
        content: string,
        role: "system" | "user",
        loader: boolean = false,
        children: React.ReactNode = null,
        streaming: boolean = false,
        messageActions: boolean = true,
        newMessage: boolean = false,
        abortSignal?: AbortSignal,
    ): Promise<void> => {
        const messageId = lastSystemMessageId.current ? lastSystemMessageId.current : Date.now().toString();

        if (role === "system") {
            content += `\n\n`;
            lastSystemMessageId.current = messageId;
        } else {
            // if (lastSystemMessageId.current) {
            //   setMessages((prev) =>
            //     prev.map((message) => {
            //       if (message.id === lastSystemMessageId.current) {
            //         return {
            //           ...message,
            //           children: null,
            //         }
            //       }
            //       return message
            //     })
            //   )
            // }
            lastSystemMessageId.current = null;
        }

        if (streaming) {
            const simulatedStream = simulateReadableStream(content, Math.floor(Math.random() * (10 - 5 + 1)) + 5, 3);
            const reader: ReadableStreamDefaultReader<any> = simulatedStream.getReader();
            await processStream(
                reader,
                undefined,
                undefined,
                children,
                messageActions,
                loader,
                abortSignal,
                newMessage,
            );
        } else {
            const newMessage = {
                id: messageId,
                content,
                children: loader ? <MessageLoader /> : children,
                createdAt: new Date(),
                role,
                messageActions,
            };
            setMessages((prev) => [...prev, newMessage]);
        }
    };

    const reset = (): void => {
        setMessages([initialMessage]);
        lastSystemMessageId.current = null;
    };

    const processNextStream = async (): Promise<void> => {
        if (streamQueue.current.length > 0) {
            const next = streamQueue.current.shift()!;
            next &&
                (await processStream(
                    next.reader,
                    next.onComplete,
                    next.chatMessageId,
                    next.children,
                    next.messageActions,
                    next.loader,
                    next.abortSignal,
                    next.newMessage,
                ));
        }
    };

    const processStream = (
        reader: ReadableStreamDefaultReader<any>,
        onComplete?: Function,
        chatMessageId?: string,
        children?: React.ReactNode,
        messageActions?: boolean,
        loader?: boolean,
        abortSignal?: AbortSignal,
        newMessage?: boolean,
    ): Promise<void> | undefined => {
        if (isStreaming.current) {
            streamQueue.current.push({
                reader,
                setMessages,
                onComplete,
                chatMessageId,
                children,
                messageActions,
                loader,
                abortSignal,
                newMessage,
            });
            return;
        }
        isStreaming.current = true;
        setIsLoading(true);

        let count = 0;
        // Function to process text from the stream
        const processText = async ({
            done,
            value,
        }: {
            done: boolean;
            value?: AllowSharedBufferSource | undefined;
        }): Promise<void> => {
            if (done) {
                onComplete && (await onComplete(responseBuffer));
                isStreaming.current = false;
                setIsLoading(false);
                await processNextStream();
                return;
            }
            responseBuffer += decoder.decode(value);
            setMessages((prevMessages) => {
                // If there are no previous messages or the last message had a role of 'user', create a new message
                if (
                    prevMessages.length === 0 ||
                    prevMessages[prevMessages.length - 1].role === "user" ||
                    (newMessage && count === 0)
                ) {
                    return [
                        ...prevMessages,
                        {
                            id: Date.now().toString(),
                            content: decoder.decode(value),
                            role: "system",
                            createdAt: new Date(),
                            messageActions: messageActions,
                            children: loader ? <MessageLoader /> : children || null,
                        },
                    ];
                }

                // If the last message had a role of 'system'
                return prevMessages.map((message, index) =>
                    index === prevMessages.length - 1
                        ? count <= 2
                            ? {
                                  ...message,
                                  content: message.content + decoder.decode(value),
                                  children: loader ? <MessageLoader /> : children || null,
                                  messageActions: messageActions,
                              }
                            : {
                                  ...message,
                                  content: message.content + decoder.decode(value),
                              }
                        : message,
                );
            });

            // Continue reading the stream
            try {
                count++;
                if (abortSignal?.aborted) {
                    return;
                }

                const nextChunk = await reader.read();
                await processText(nextChunk);
            } catch (error) {
                if (error instanceof DOMException) {
                    isStreaming.current = false;
                    setIsLoading(false);
                    await processNextStream();
                    return;
                } else {
                    console.error("Error while reading the stream:", error);
                }
            }
        };

        if (reader) {
            // Start processing the stream
            reader
                .read()
                .then(processText)
                .catch((error) => {
                    console.error("Error while starting the stream:", error);
                });
        }
    };

    return {
        messages: messages || [],
        setMessages,
        isLoading,
        setIsLoading,
        lastSystemMessageId,
        isOpen,
        open,
        close,
        toggle,
        processStream,
        appendMessage,
        reset,
    } as Chat;
}
