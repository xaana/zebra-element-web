import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

export const markdownToHtml = async (markdown: string): Promise<string> => {
    try {
        const result = await unified().use(remarkParse).use(remarkGfm).use(remarkHtml).process(markdown);
        return String(result);
    } catch (e) {
        throw e;
    }
};
