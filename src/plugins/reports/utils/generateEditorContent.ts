import * as htmlparser2 from "htmlparser2";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

export const streamContent = async (
    htmlContent: string,
    contentBuffer: React.MutableRefObject<string>,
    insertText: (text: string, selectInsertedText?: boolean) => void,
): Promise<void> => {
    // if (!editor) return Promise.resolve();

    const openTagsStack: string[] = [];
    let position = contentBuffer.current.length;
    const parser = new htmlparser2.Parser(
        {
            onopentag(tagName, attributes): void {
                const attrs = Object.entries(attributes)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(" ");
                const tag = `<${tagName}${attrs ? " " + attrs : ""}>`;
                contentBuffer.current += tag;
                openTagsStack.push(`</${tagName}>`);
            },
            ontext(text): void {
                contentBuffer.current += text;
            },
            onclosetag(): void {
                contentBuffer.current += openTagsStack.pop();
            },
        },
        { decodeEntities: true },
    );

    parser.write(htmlContent);
    parser.end();

    const delay = 60;
    return new Promise((resolve) => {
        const updateContentInChunks = (): void => {
            const chunkSize = Math.floor(Math.random() * (5 - 15 + 1)) + 15;
            if (position < contentBuffer.current.length) {
                let nextPosition = position + chunkSize;
                if (nextPosition > contentBuffer.current.length) {
                    nextPosition = contentBuffer.current.length;
                }
                const contentChunk = contentBuffer.current.slice(0, nextPosition);

                const tempCloseTags = openTagsStack.slice().reverse().join("");
                const tempOpenTags = openTagsStack.map((tag) => tag.replace("/", "")).join("");

                // editor.commands.setContent(contentChunk + tempCloseTags + tempOpenTags);
                insertText(contentChunk + tempCloseTags + tempOpenTags, false);
                position = nextPosition;
                setTimeout(updateContentInChunks, delay);
            } else {
                // editor.commands.setContent(contentBuffer.current);
                insertText(contentBuffer.current, false);
                // editor.commands.selectTextblockEnd();
                // editor.commands.scrollIntoView();
                resolve();
            }
        };
        updateContentInChunks();
    });
};

export const generateContentFromOutlines = async (
    documentPrompt: string,
    currentTitle: string,
    allTitles: string[],
    contentSize: string,
    targetAudience?: string,
    tone?: string,
    mediaIds?: string[],
): Promise<string | undefined> => {
    try {
        const res = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/generate/content`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                current_title: currentTitle,
                document_prompt: documentPrompt,
                all_titles: allTitles,
                content_size: contentSize,
                ...(targetAudience && { target_audience: targetAudience }),
                ...(tone && { tone: tone }),
                ...(mediaIds && mediaIds.length > 0 && { content_media_ids: mediaIds }),
            }),
        });
        const data = await res.json();
        let content = data.content;
        if (content) {
            content = content
                .replace(/\n/g, "")
                .replace(/<th>/g, '<td style="background-color: #f5f5f5; font-weight: 700;">')
                .replace(/<\/th>/g, "</td>");
        }
        if (!content) throw new Error("No content generated", data);

        return content;
    } catch (errPayload: any) {
        console.error(`An error occurred: ${errPayload?.response?.data?.error ?? errPayload}`);
        throw errPayload;
    }
};

export const generateContentFromRequirements = async (
    requirementDocumentIds: string, // csv
    supportingDocumentIds: string, // csv
    responseLength: string,
    userId: string,
): Promise<string | undefined> => {
    try {
        const res = await fetch(`${SettingsStore.getValue("cockpitApiUrl")}/v1/workflows/run`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer app-tgdwV3QrhqtBb0UaiyYi5mBV",
            },
            body: JSON.stringify({
                inputs: {
                    requirement_csv: requirementDocumentIds,
                    supporting_csv: supportingDocumentIds,
                    response_length: responseLength,
                },
                response_mode: "blocking",
                user: userId,
            }),
        });

        const response = await res.json();
        if (response.data.status === "succeeded") {
            return response.data.outputs.text;
        }
        return;
        // if (data.answer) {
        //     return data.answer as string;
        // } else return;
    } catch (errPayload: any) {
        console.error(`An error occurred: ${errPayload?.response?.data?.error ?? errPayload}`);
        throw errPayload;
    }
};
