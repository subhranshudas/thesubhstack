import type { Metadata } from "next";
import { Suspense } from "react";
import BlogCard from "@/components/blog/BlogCard";
import TagFilter from "@/components/blog/TagFilter";
import type { BlogPost } from "@/types/notion";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering posts on full-stack development, system design, TypeScript, Python, and AI — by Subhranshu.",
  openGraph: {
    title: "Blog · subhstack",
    description: "Engineering deep-dives and technical writing.",
  },
};

// Next.js will revalidate this page every 5 minutes
export const revalidate = 1800;

async function getPosts(): Promise<BlogPost[]> {
  try {
    const { getAllPosts } = await import("@/lib/notion");
    return await getAllPosts();
  } catch {
    return [];
  }
}

interface BlogsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { tag } = await searchParams;
  const allPosts = await getPosts();

  // Collect unique tags
  const allTags = Array.from(
    new Set(allPosts.flatMap((p) => p.tags))
  ).sort();

  const filteredPosts = tag
    ? allPosts.filter((p) => p.tags.includes(tag))
    : allPosts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "thesubhstack blog",
    url: "https://www.thesubhstack.com/blogs",
    author: {
      "@type": "Person",
      name: "Subhranshu",
      url: "https://www.thesubhstack.com",
    },
    blogPost: filteredPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.publishedAt,
      url: `https://www.thesubhstack.com/blogs/${p.slug}`,
      keywords: p.tags.join(", "),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              ~/
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--accent-primary)" }}>
              blog
            </span>
          </div>
          <h1
            className="font-mono text-2xl md:text-3xl font-bold tracking-tight mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Writing
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} on
            engineering, systems, AI and the craft of software.
          </p>
        </div>


        {/* Post list */}
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            {allPosts.length === 0 ? (
              <div>
                <p className="font-mono text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                  No posts yet. Coming soon...
                </p>
                <p className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>
                  (Connect your Notion database to get started)
                </p>
              </div>
            ) : (
              <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
                No posts tagged &ldquo;{tag}&rdquo;.
              </p>
            )}
          </div>
        ) : (
          <ol
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5"
            role="list"
          >
            {filteredPosts.map((post) => (
              <li key={post.id}>
                <BlogCard post={post} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
