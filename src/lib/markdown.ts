import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";
import { highlightCode } from "./shiki";
import type { Root, Element } from "hast";

// ─── Custom rehype plugin: Shiki code highlighting ─────────────────────────

function rehypeShikiHighlight() {
  return async function (tree: Root) {
    const nodes: { node: Element; parent: Element; index: number }[] = [];

    visit(tree, "element", (node: Element, index, parent) => {
      if (
        node.tagName === "code" &&
        parent &&
        (parent as Element).tagName === "pre"
      ) {
        const className = (node.properties?.className as string[]) ?? [];
        const langClass = className.find((c) => c.startsWith("language-"));
        const lang = langClass ? langClass.replace("language-", "") : "plaintext";

        // Skip mermaid — handled separately client-side
        if (lang === "mermaid") return;

        const codeText =
          (node.children[0] as { value?: string })?.value?.trimEnd() ?? "";

        nodes.push({ node, parent: parent as Element, index: index as number });

        // Store for async processing
        (node as Element & { __lang: string; __code: string }).__lang = lang;
        (node as Element & { __lang: string; __code: string }).__code = codeText;
      }
    });

    // Process all highlighted code blocks
    await Promise.all(
      nodes.map(async ({ node, parent, index }) => {
        const typedNode = node as Element & { __lang: string; __code: string };
        const lang = typedNode.__lang;
        const code = typedNode.__code;

        const html = await highlightCode(code, lang);

        // Wrap in our custom structure
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["code-block-wrapper", "not-prose"],
            "data-lang": lang,
          },
          children: [
            {
              type: "element",
              tagName: "div",
              properties: { className: ["code-block-header"] },
              children: [
                {
                  type: "element",
                  tagName: "span",
                  properties: { className: ["lang-badge"] },
                  children: [{ type: "text", value: lang }],
                },
                {
                  type: "element",
                  tagName: "button",
                  properties: {
                    className: ["copy-btn"],
                    "data-code": code,
                    "aria-label": "Copy code",
                  },
                  children: [{ type: "text", value: "copy" }],
                },
              ],
            },
            {
              type: "raw",
              value: html,
            } as unknown as Element,
          ],
        };

        const parentChildren = parent.children as (typeof parent.children);
        parentChildren.splice(index, 1, wrapper);
      })
    );
  };
}

// ─── Custom rehype plugin: Mermaid placeholder ─────────────────────────────

function rehypeMermaidPlaceholder() {
  return function (tree: Root) {
    visit(tree, "element", (node: Element, index, parent) => {
      if (
        node.tagName === "code" &&
        parent &&
        (parent as Element).tagName === "pre"
      ) {
        const className = (node.properties?.className as string[]) ?? [];
        const langClass = className.find((c) => c.startsWith("language-"));
        const lang = langClass?.replace("language-", "");

        if (lang !== "mermaid") return;

        const chart =
          (node.children[0] as { value?: string })?.value?.trim() ?? "";

        const placeholder: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["mermaid-placeholder"],
            "data-mermaid": encodeURIComponent(chart),
          },
          children: [],
        };

        const parentChildren = parent.children as (typeof parent.children);
        parentChildren.splice(index as number, 1, placeholder);
      }
    });
  };
}

// ─── Main function ──────────────────────────────────────────────────────────

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeMermaidPlaceholder)
    .use(rehypeShikiHighlight)
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return String(result);
}
