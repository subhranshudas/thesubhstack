# subhstack — Engineering Blog & Portfolio

Personal engineering blog and portfolio site built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Notion** as the CMS.

## Features

- **Dark theme** — permanent dark mode with a teal/cyan accent palette; designed to last 3+ years without overhaul
- **Notion CMS** — write posts in Notion, publish by setting `Status → Published`
- **Syntax highlighting** — server-side with [Shiki](https://shiki.style/) (`github-dark-dimmed` theme)
- **Mermaid diagrams** — write `\`\`\`mermaid` blocks in Notion; rendered client-side with proper dark theme
- **Math (KaTeX)** — `$inline$` and `$$block$$` LaTeX equations
- **Table of Contents** — auto-generated with active heading tracking
- **Reading progress bar** — fixed progress indicator at page top
- **AI agent friendly** — `robots.txt` (allows GPTBot, ClaudeBot, etc.), `sitemap.xml`, `llms.txt`, JSON-LD structured data
- **Copy buttons** — one-click code copying on all code blocks

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd thesubhstack-2026
npm install
```

### 2. Set up environment

```bash
cp .env.example .env.local
# Fill in your Notion credentials
```

### 3. Set up Notion

Create a Notion integration at https://www.notion.so/my-integrations and share your database with it.

Your Notion database needs these properties:

| Property | Type | Notes |
|---|---|---|
| `Title` or `Name` | Title | Post title |
| `Slug` | Text | URL slug e.g. `my-first-post` |
| `Status` | Select | Must have `Published` option |
| `PublishedAt` | Date | Publication date |
| `Tags` | Multi-select | Optional tags |
| `Excerpt` or `Description` | Text | Short summary |

### 4. Run locally

```bash
npm run dev
```

## Blog Paths

- Blog list: `/blogs`
- Individual post: `/blogs/{slug}`

## Writing Diagrams

In Notion, create a Code block and set the language to `mermaid`:

```
graph TD
  A[Start] --> B{Decision}
  B --> |Yes| C[End]
  B --> |No| D[Loop back]
  D --> A
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, global metadata
│   ├── page.tsx            # Landing page (resume)
│   ├── blogs/
│   │   ├── page.tsx        # Blog list with tag filtering
│   │   └── [slug]/page.tsx # Individual blog post
│   ├── sitemap.ts          # Dynamic XML sitemap
│   ├── robots.ts           # robots.txt (AI-agent friendly)
│   └── llms.txt/route.ts   # llms.txt for AI agents
├── components/
│   ├── layout/             # Header, Footer
│   ├── resume/             # Landing page sections
│   └── blog/               # Blog components
├── lib/
│   ├── notion.ts           # Notion API client
│   ├── markdown.ts         # unified/remark/rehype pipeline
│   ├── shiki.ts            # Syntax highlighter
│   └── utils.ts            # Helpers
└── types/
    └── notion.ts           # TypeScript types
```

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Set the environment variables in Vercel dashboard.

## AI Agent Endpoints

| Endpoint | Purpose |
|---|---|
| `/robots.txt` | Crawl permissions (AI bots explicitly allowed) |
| `/sitemap.xml` | Full URL index |
| `/llms.txt` | Human-readable site summary for LLMs |
