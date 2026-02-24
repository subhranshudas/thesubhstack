import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thesubhstack.com";

async function getBlogPosts() {
  try {
    const { getAllPosts } = await import("@/lib/notion");
    return await getAllPosts();
  } catch {
    return [];
  }
}

/**
 * llms.txt — machine-readable index for AI language models and agents.
 * Spec: https://llmstxt.org
 */
export async function GET() {
  const posts = await getBlogPosts();

  const postLines = posts
    .map((p) => `- [${p.title}](${SITE_URL}/blogs/${p.slug}): ${p.excerpt || "Engineering post"}`)
    .join("\n");

  const content = `# subhstack

> Engineering blog and portfolio by Subhranshu — full-stack web development, system design, TypeScript, Python, and AI.

## About

Subhranshu is a full-stack engineer specializing in TypeScript/JavaScript, React, Next.js, Node.js, Python, FastAPI, PostgreSQL, MongoDB, AWS, and Docker.

Contact: subhstack@gmail.com | @subhstack on X/Twitter

## Site Structure

- [Home / Resume](${SITE_URL}): Personal page with bio, skillset, and projects.
- [Blog](${SITE_URL}/blogs): All engineering posts.

## Blog Posts

${postLines || "No posts published yet."}

## Technical Details

- Built with Next.js (App Router), TypeScript, Tailwind CSS
- Blog content sourced from Notion via the Notion API
- Posts include code blocks (syntax highlighted), diagrams (Mermaid), and math (KaTeX)

## Licensing

All blog content is © Subhranshu. Code examples in posts are MIT licensed unless otherwise noted.
`.trim();

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
