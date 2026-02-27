import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import type { BlogPost, BlogPostFull, TocItem } from "@/types/notion";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Notion file-type images are pre-signed S3 URLs that expire after 1 hour.
// Instead of baking the expiring URL into the markdown/HTML, emit a stable
// proxy path (/api/notion-image?blockId=xxx) that fetches a fresh URL on demand.
n2m.setCustomTransformer("image", async (block) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b = block as any;
  const blockId: string = b.id;
  const caption: string =
    b.image?.caption?.map((c: { plain_text: string }) => c.plain_text).join("") ?? "";
  return `![${caption}](/api/notion-image?blockId=${blockId})`;
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

// ─── Helpers ──────────────────────────────────────────────────────────────

function extractText(property: Record<string, unknown>): string {
  if (!property) return "";
  const type = property.type as string;

  if (type === "title") {
    const titleArr = property.title as Array<{ plain_text: string }>;
    return titleArr?.map((t) => t.plain_text).join("") ?? "";
  }
  if (type === "rich_text") {
    const rtArr = property.rich_text as Array<{ plain_text: string }>;
    return rtArr?.map((t) => t.plain_text).join("") ?? "";
  }
  if (type === "select") {
    const sel = property.select as { name: string } | null;
    return sel?.name ?? "";
  }
  if (type === "url") {
    return (property.url as string) ?? "";
  }
  return "";
}

function extractTags(property: Record<string, unknown>): string[] {
  if (!property || property.type !== "multi_select") return [];
  const ms = property.multi_select as Array<{ name: string }>;
  return ms?.map((t) => t.name) ?? [];
}

function extractDate(property: Record<string, unknown>): string {
  if (!property || property.type !== "date") return "";
  const date = property.date as { start: string } | null;
  return date?.start ?? "";
}

function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function hasCover(
  cover: { type: string; external?: { url: string }; file?: { url: string } } | null
): boolean {
  if (!cover) return false;
  if (cover.type === "external") return !!cover.external?.url;
  if (cover.type === "file") return !!cover.file?.url;
  return false;
}

// Returns a stable proxy URL for the page's cover image. The proxy fetches a
// fresh pre-signed S3 URL from Notion at request time, avoiding expiry issues.
function getCoverProxyUrl(pageId: string, cover: { type: string } | null): string | undefined {
  if (!hasCover(cover as { type: string; external?: { url: string }; file?: { url: string } } | null)) return undefined;
  return `/api/notion-cover?pageId=${pageId}`;
}

function extractTableOfContents(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const toc: TocItem[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      toc.push({ id, text, level });
    }
  }
  return toc;
}

// ─── Public API ───────────────────────────────────────────────────────────

/**
 * Fetch all published blog posts from Notion database (metadata only).
 * Cached with Next.js fetch cache – revalidates every 5 minutes.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "BlogStatus",
      select: { equals: "Published" },
    },
    sorts: [
      {
        property: "PublishedAt",
        direction: "descending",
      },
    ],
  });

  return response.results
    .map((page) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const p = page as any;
      const props = p.properties ?? {};

      const slug = extractText(props.Slug) || p.id;
      const publishedAt =
        extractDate(props.PublishedAt) || p.created_time?.slice(0, 10) || "";

      return {
        id: p.id,
        slug,
        title: extractText(props.Title || props.Name),
        excerpt: extractText(props.Excerpt || props.Description),
        publishedAt,
        updatedAt: p.last_edited_time?.slice(0, 10) ?? publishedAt,
        tags: extractTags(props.Tags),
        coverImage: getCoverProxyUrl(p.id, p.cover),
        readingTime: 0, // will be recalculated when full content fetched
        status: "published" as const,
      };
    })
    .filter((p) => p.title && p.slug);
}

/**
 * Fetch a single post with full markdown content.
 */
export async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          property: "BlogStatus",
          select: { equals: "Published" },
        },
        {
          property: "Slug",
          rich_text: { equals: slug },
        },
      ],
    },
  });

  if (!response.results.length) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = response.results[0] as any;
  const props = page.properties ?? {};

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const markdown = n2m.toMarkdownString(mdBlocks).parent;

  const publishedAt =
    extractDate(props.PublishedAt) || page.created_time?.slice(0, 10) || "";

  return {
    id: page.id,
    slug,
    title: extractText(props.Title || props.Name),
    excerpt: extractText(props.Excerpt || props.Description),
    publishedAt,
    updatedAt: page.last_edited_time?.slice(0, 10) ?? publishedAt,
    tags: extractTags(props.Tags),
    coverImage: getCoverProxyUrl(page.id, page.cover),
    readingTime: estimateReadingTime(markdown),
    status: "published",
    content: markdown,
    tableOfContents: extractTableOfContents(markdown),
  };
}

/**
 * Get all slugs for static generation.
 */
export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
