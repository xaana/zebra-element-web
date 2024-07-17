import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';

export const markdownToHtml = async (markdown: string): Promise<string> => {
    try {
        const result = await unified()
            .use(remarkParse)     // Parse the Markdown text
            .use(remarkGfm)       // Apply GitHub Flavored Markdown transformations
            .use(remarkRehype)    // Bridge from remark Markdown to rehype HTML
            .use(rehypeFormat)    // Format the HTML output
            .use(rehypeStringify) // Convert the HAST to an HTML string
            .process(markdown);
        return String(result);
    } catch (e) {
        throw e;
    }
};
