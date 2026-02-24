import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="font-mono mb-6" style={{ color: "var(--text-faint)" }}>
        <div className="text-6xl mb-4">404</div>
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          <span style={{ color: "var(--accent-primary)" }}>error:</span>{" "}
          file not found
        </div>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        This page doesn&apos;t exist. It may have been moved or never existed.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/"
          className="font-mono text-sm px-4 py-2 rounded border transition-all"
          style={{
            color: "var(--accent-primary)",
            borderColor: "var(--accent-primary)",
            backgroundColor: "var(--accent-subtle)",
          }}
        >
          ~/home
        </Link>
        <Link
          href="/blogs"
          className="font-mono text-sm px-4 py-2 rounded border transition-all"
          style={{
            color: "var(--text-secondary)",
            borderColor: "var(--border-default)",
          }}
        >
          ~/blog
        </Link>
      </div>
    </div>
  );
}
