import { markdownToHtml } from "@/lib/markdown";
import MermaidHydrator from "./MermaidHydrator";

interface MarkdownRendererProps {
  content: string;
}

export default async function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = await markdownToHtml(content);

  return (
    <>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {/* Client component that finds .mermaid-placeholder divs and renders them */}
      <MermaidHydrator />
    </>
  );
}
