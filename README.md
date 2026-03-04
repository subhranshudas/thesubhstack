# thesubhstack — Engineering Blog & Portfolio

Personal engineering blog and portfolio site built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Notion** as the CMS.

Live at: [www.thesubhstack.com](https://www.thesubhstack.com)

## Features

- **Dark theme** — permanent dark mode with a teal/cyan accent palette;
- **Notion CMS** — write posts in Notion, publish by setting `BlogStatus → Published`
- **Syntax highlighting** — server-side with [Shiki](https://shiki.style/) (`github-dark-dimmed` theme) with one-click copy buttons
- **Mermaid diagrams** — write ` ```mermaid ` blocks in Notion; rendered client-side with matching dark theme
- **Math (KaTeX)** — `$inline$` and `$$block$$` LaTeX equations
- **Image captions** — add a caption to any image in Notion; it becomes the hover tooltip (`title`) and accessibility alt text (`alt`) automatically
- **Notion image proxy** — uploaded images and page covers are served through `/api/notion-image` and `/api/notion-cover`, which fetch a fresh pre-signed S3 URL from Notion on demand; eliminates the "AccessDenied / Request has expired" error that occurs when Notion's 1-hour S3 URLs are baked into cached HTML
- **AI agent friendly** — `robots.txt` (allows GPTBot, ClaudeBot, PerplexityBot, etc.), `sitemap.xml`, `llms.txt`, JSON-LD structured data

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd thesubhstack
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
# Fill in your Notion credentials
```

### 3. Set up Notion

Create an **Internal Integration** at [notion.so/profile/integrations](https://www.notion.so/profile/integrations) (under **Build → Internal integrations**). Copy the `ntn_` token — that is your `NOTION_TOKEN`.

Your Notion database needs these exact properties:

| Property | Type | Notes |
|---|---|---|
| `Name` | Title | Post title (default column) |
| `Slug` | Text | URL slug e.g. `my-first-post` |
| `BlogStatus` | Select | Must have `Published` and `Draft` options |
| `PublishedAt` | Date | Publication date |
| `Tags` | Multi-select | Optional tags shown on cards |
| `Excerpt` | Text | Short summary shown on blog card |

**Cover image** — set via Notion's built-in page cover (click "Add cover" inside the page). Both uploaded files and external URLs are supported; the site proxies all cover images through `/api/notion-cover` so Notion's 1-hour S3 expiry never causes broken images.

After creating the database, go to the integration's **Content access** tab and add the database there.

### 4. Get your Database ID

Open the database as a full page. The URL looks like:
```
https://www.notion.so/83b2e1f4a0c04b9d8e3f1234abcd5678?v=...
```
The hex string before `?v=` is your `NOTION_DATABASE_ID`.

### 5. Fill in `.env.local`

```bash
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=83b2e1f4a0c04b9d8e3f1234abcd5678
NEXT_PUBLIC_SITE_URL=https://www.thesubhstack.com
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Publishing a Post

1. Create a new page in your Notion database
2. Fill in `Slug`, `PublishedAt`, `Tags`, `Excerpt`
3. Write the body content (headings, paragraphs, code blocks, diagrams)
4. Set `BlogStatus` to `Published`
5. The site revalidates every 5 minutes automatically

## Blog Paths

- Blog list: `/blogs`
- Individual post: `/blogs/{slug}`

## Writing Code Blocks

In Notion, create a Code block and select the language. Supported: `typescript`, `javascript`, `python`, `bash`, `sql`, `go`, `rust`, `json`, `yaml`, `dockerfile`, and more.

## Writing Diagrams

In Notion, create a Code block and set the language to `mermaid`:

```
graph TD
  A[Start] --> B{Decision}
  B --> |Yes| C[End]
  B --> |No| D[Loop back]
  D --> A
```

## Adding Image Captions

In Notion, click an image block and add a caption beneath it. That caption is automatically used as:

- The **`alt` attribute** — shown if the image fails to load; read by screen readers
- The **`title` attribute** — shown as a native browser tooltip on hover

Clicking any image in a post opens the full-resolution version in a new tab.

## Writing Math

Inline: `$E = mc^2$`

Block:
```
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, global metadata
│   ├── page.tsx                # Landing page (resume)
│   ├── not-found.tsx           # 404 page
│   ├── blogs/
│   │   ├── page.tsx            # Blog list (2-col grid on desktop)
│   │   └── [slug]/page.tsx     # Individual blog post
│   ├── sitemap.ts              # Dynamic XML sitemap
│   ├── robots.ts               # robots.txt (AI-agent friendly)
│   ├── llms.txt/route.ts       # llms.txt for AI agents
│   └── api/
│       ├── notion-image/       # Proxy: fetches fresh S3 URL for image blocks (?blockId=)
│       └── notion-cover/       # Proxy: fetches fresh S3 URL for page covers (?pageId=)
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky nav header
│   │   └── Footer.tsx          # Footer with links
│   ├── resume/
│   │   ├── AboutSection.tsx
│   │   ├── SkillsetSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── ContactSection.tsx
│   └── blog/
│       ├── BlogCard.tsx        # Card with image, tags, excerpt
│       ├── MarkdownRenderer.tsx # Server component: renders post content
│       ├── MermaidHydrator.tsx  # Client: hydrates Mermaid diagrams
│       ├── CodeCopyHydrator.tsx # Client: copy button for code blocks
│       ├── TableOfContents.tsx  # Sticky ToC sidebar (desktop)
│       └── ReadingProgress.tsx  # Reading progress bar
├── lib/
│   ├── notion.ts               # Notion API client (getAllPosts, getPostBySlug)
│   ├── markdown.ts             # unified/remark/rehype pipeline
│   ├── shiki.ts                # Server-side syntax highlighter
│   └── utils.ts                # cn(), formatDate(), slugify()
└── types/
    └── notion.ts               # TypeScript types for posts
```


Set these environment variables in the Vercel dashboard:
- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`
- `NEXT_PUBLIC_SITE_URL`

## AI Agent Endpoints

| Endpoint | Purpose |
|---|---|
| `/robots.txt` | Crawl permissions — GPTBot, ClaudeBot, PerplexityBot, anthropic-ai explicitly allowed |
| `/sitemap.xml` | Full URL index, dynamically includes all published posts |
| `/llms.txt` | Machine-readable site + post index for LLMs |
