import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import TableOfContents from "@/components/blog/TableOfContents";
import ReadingProgress from "@/components/blog/ReadingProgress";
import CodeCopyHydrator from "@/components/blog/CodeCopyHydrator";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

async function getPost(slug: string) {
  try {
    const { getPostBySlug } = await import("@/lib/notion");
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}

async function getSlugs() {
  try {
    const { getAllSlugs } = await import("@/lib/notion");
    return await getAllSlugs();
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thesubhstack.com";

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: "Subhranshu", url: SITE_URL }],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blogs/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      authors: ["Subhranshu"],
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      site: "@subhstack",
      creator: "@subhstack",
    },
    alternates: {
      canonical: `${SITE_URL}/blogs/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thesubhstack.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blogs/${post.slug}`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "Subhranshu",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Subhranshu",
      url: SITE_URL,
    },
    keywords: post.tags.join(", "),
    url: `${SITE_URL}/blogs/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blogs/${post.slug}` },
    ...(post.coverImage && {
      image: {
        "@type": "ImageObject",
        url: post.coverImage,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <CodeCopyHydrator />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/blogs"
            className="font-mono text-xs transition-colors hover:text-accent inline-flex items-center gap-1"
            style={{ color: "var(--text-muted)" }}
          >
            ← all posts
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 lg:items-start">
          {/* Main content */}
          <article aria-labelledby="post-title">
            {/* Cover image */}
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full rounded-md mb-8 border"
                style={{ borderColor: "var(--border-dim)", aspectRatio: "16/9", objectFit: "cover" }}
              />
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 mb-4" role="list">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/blogs?tag=${encodeURIComponent(tag)}`}
                      className="font-mono text-xs px-1.5 py-0.5 rounded transition-colors hover:opacity-80"
                      style={{
                        color: "var(--accent-primary)",
                        backgroundColor: "var(--accent-subtle)",
                        border: "1px solid var(--accent-dim)",
                      }}
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Title */}
            <h1
              id="post-title"
              className="font-mono text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              {post.title}
            </h1>

            {/* Meta */}
            <div
              className="flex flex-wrap items-center gap-3 font-mono text-xs mb-8 pb-8 border-b"
              style={{ color: "var(--text-muted)", borderColor: "var(--border-dim)" }}
            >
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
              {post.updatedAt !== post.publishedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    updated{" "}
                    <time dateTime={post.updatedAt}>
                      {formatDate(post.updatedAt)}
                    </time>
                  </span>
                </>
              )}
            </div>

            {/* Content */}
            <MarkdownRenderer content={post.content} />

            {/* Footer */}
            <div
              className="mt-12 pt-8 border-t flex items-center justify-between"
              style={{ borderColor: "var(--border-dim)" }}
            >
              <Link
                href="/blogs"
                className="font-mono text-xs transition-colors hover:text-accent"
                style={{ color: "var(--text-muted)" }}
              >
                ← back to blog
              </Link>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${SITE_URL}/blogs/${post.slug}`)}&via=subhstack`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs transition-colors hover:text-accent"
                style={{ color: "var(--text-muted)" }}
              >
                share on X →
              </a>
            </div>
          </article>

          {/* Sidebar: Table of Contents */}
          {post.tableOfContents.length > 0 && (
            <aside className="hidden lg:block" aria-label="Table of contents">
              <TableOfContents items={post.tableOfContents} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
