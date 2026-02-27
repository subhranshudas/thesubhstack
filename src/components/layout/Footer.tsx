const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FOOTER_LINKS = [
  {
    href: "mailto:subhstack@gmail.com",
    label: "subhstack@gmail.com",
    icon: <MailIcon />,
    rel: undefined as string | undefined,
  },
  {
    href: "https://twitter.com/subhstack",
    label: "@subhstack on X (Twitter)",
    icon: <XIcon />,
    rel: "noopener noreferrer",
  },
  {
    href: "/sitemap.xml",
    label: "sitemap",
    icon: null,
    rel: undefined,
  },
  {
    href: "/llms.txt",
    label: "llms.txt",
    icon: null,
    rel: undefined,
  },
];

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
              {FOOTER_LINKS.map(({ href, label, icon, rel }) => (
                <li key={href}>
                  <a
                    href={href}
                    rel={rel}
                    target={rel ? "_blank" : undefined}
                    className="footer-link transition-colors"
                    aria-label={label}
                  >
                    {icon ? (
                      <>
                        {icon}
                        <span className="sr-only">{label}</span>
                      </>
                    ) : (
                      <span className="font-mono text-xs">{label}</span>
                    )}
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
