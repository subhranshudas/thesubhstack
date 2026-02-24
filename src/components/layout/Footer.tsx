export default function Footer() {
  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: "var(--border-dim)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: brand */}
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: "var(--accent-primary)" }}
          >
            thesubhstack
          </span>

          {/* Right: links */}
          <nav aria-label="Footer links">
            <ul className="flex flex-wrap items-center gap-3 sm:gap-4" role="list">
              {[
                { href: "mailto:subhstack@gmail.com", label: "email" },
                { href: "https://twitter.com/subhstack", label: "@subhstack", rel: "noopener noreferrer" },
                { href: "/sitemap.xml", label: "sitemap" },
                { href: "/llms.txt", label: "llms.txt" },
              ].map(({ href, label, rel }) => (
                <li key={href}>
                  <a
                    href={href}
                    rel={rel}
                    target={rel ? "_blank" : undefined}
                    className="footer-link font-mono text-xs transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
