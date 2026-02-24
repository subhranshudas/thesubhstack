"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "~/home" },
  { href: "/blogs", label: "~/blog" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ borderColor: "var(--border-dim)", backgroundColor: "var(--bg-base)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm font-semibold shrink-0 transition-colors"
          style={{ color: "var(--accent-primary)" }}
        >
          thesubhstack
        </Link>

        {/* Nav */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "font-mono text-xs px-2.5 sm:px-3 py-1.5 rounded transition-all whitespace-nowrap",
                      isActive ? "border" : ""
                    )}
                    style={
                      isActive
                        ? {
                            color: "var(--accent-primary)",
                            borderColor: "var(--accent-primary)",
                            backgroundColor: "var(--accent-subtle)",
                          }
                        : { color: "var(--text-secondary)" }
                    }
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
