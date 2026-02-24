"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TagFilterProps {
  tags: string[];
}

export default function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";

  function handleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === activeTag) {
      params.delete("tag");
    } else {
      params.set("tag", tag);
    }
    router.push(`/blogs?${params.toString()}`, { scroll: false });
  }

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      {tags.map((tag) => {
        const isActive = tag === activeTag;
        return (
          <button
            key={tag}
            onClick={() => handleTag(tag)}
            className="font-mono text-xs px-2.5 py-1 rounded border transition-all"
            style={
              isActive
                ? {
                    color: "var(--accent-primary)",
                    backgroundColor: "var(--accent-subtle)",
                    borderColor: "var(--accent-primary)",
                  }
                : {
                    color: "var(--text-muted)",
                    backgroundColor: "transparent",
                    borderColor: "var(--border-dim)",
                  }
            }
            aria-pressed={isActive}
          >
            {tag}
          </button>
        );
      })}
      {activeTag && (
        <button
          onClick={() => handleTag("")}
          className="font-mono text-xs px-2.5 py-1 rounded border transition-all"
          style={{
            color: "var(--text-muted)",
            borderColor: "var(--border-dim)",
          }}
          aria-label="Clear tag filter"
        >
          × clear
        </button>
      )}
    </div>
  );
}
