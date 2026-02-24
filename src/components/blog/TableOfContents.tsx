"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/types/notion";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!items.length) return;

    const headings = items.map((item) =>
      document.getElementById(item.id)
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Table of contents" className="sticky top-20">
      <div
        className="rounded-md border p-4"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-dim)" }}
      >
        <div
          className="font-mono text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--accent-primary)" }}
        >
          On this page
        </div>
        <ol className="space-y-1.5" role="list">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block font-mono text-xs leading-snug transition-colors py-0.5 hover:text-accent",
                  activeId === item.id ? "text-accent" : ""
                )}
                style={{
                  color: activeId === item.id ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
