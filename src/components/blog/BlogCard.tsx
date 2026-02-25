import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils";
import type { BlogPost } from "@/types/notion";

interface BlogCardProps {
  post: BlogPost;
}

function getCoverGradient(title: string): string {
  const gradients = [
    "linear-gradient(135deg, #0d1f1a 0%, #0a2e24 50%, #061a15 100%)",
    "linear-gradient(135deg, #0f1520 0%, #0d1f35 50%, #081020 100%)",
    "linear-gradient(135deg, #1a0f20 0%, #2a1040 50%, #100818 100%)",
    "linear-gradient(135deg, #1a1008 0%, #2e1f06 50%, #1a1008 100%)",
    "linear-gradient(135deg, #080f1a 0%, #091824 50%, #050f18 100%)",
  ];
  const hash = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

export default function BlogCard({ post }: BlogCardProps) {
  const gradient = getCoverGradient(post.title);

  return (
    <article className="w-full h-full">
      <Link
        href={`/blogs/${post.slug}`}
        className="blog-card group flex flex-col lg:flex-row w-full h-full rounded-md border overflow-hidden"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-dim)",
        }}
      >
        {/* Cover image — top (16:9) on mobile, left fixed-width full-height on desktop */}
        <div className="relative aspect-video lg:aspect-auto w-full lg:w-44 lg:self-stretch shrink-0 overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 176px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              unoptimized
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: gradient }}
            >
              <svg
                width="100%"
                height="100%"
                className="absolute inset-0 opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id={`grid-${post.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#00d4aa" strokeWidth="0.4" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${post.id})`} />
              </svg>
              <span
                className="relative font-mono text-4xl font-bold select-none"
                style={{ color: "var(--accent-primary)", opacity: 0.4 }}
              >
                {post.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-4 min-w-0">
          {/* Tags */}
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 mb-2" role="list">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{
                    color: "var(--accent-primary)",
                    backgroundColor: "var(--accent-subtle)",
                    border: "1px solid var(--accent-dim)",
                  }}
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          {/* Title */}
          <h2
            className="font-mono text-sm font-semibold leading-snug mb-2 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className="text-xs leading-relaxed mb-auto line-clamp-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div
            className="flex items-center gap-2 font-mono text-xs mt-3 pt-3 border-t"
            style={{
              color: "var(--text-muted)",
              borderColor: "var(--border-dim)",
            }}
          >
            <time dateTime={post.publishedAt}>
              {formatDateShort(post.publishedAt)}
            </time>
            {post.readingTime > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
