import { createHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark-dimmed"],
      langs: [
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "python",
        "bash",
        "shell",
        "json",
        "yaml",
        "toml",
        "markdown",
        "sql",
        "html",
        "css",
        "rust",
        "go",
        "java",
        "cpp",
        "c",
        "dockerfile",
        "nginx",
        "plaintext",
      ],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(
  code: string,
  lang: string
): Promise<string> {
  const highlighter = await getHighlighter();
  const supportedLangs = highlighter.getLoadedLanguages();
  const safeLang = supportedLangs.includes(lang as never) ? lang : "plaintext";

  return highlighter.codeToHtml(code, {
    lang: safeLang,
    theme: "github-dark-dimmed",
    transformers: [],
  });
}
