import SectionLabel from "./SectionLabel";

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

const CONTACTS = [
  {
    href: "mailto:subhstack@gmail.com",
    display: "subhstack@gmail.com",
    icon: <MailIcon />,
  },
  {
    href: "https://twitter.com/subhstack",
    display: "@subhstack",
    icon: <XIcon />,
  },
];

export default function ContactSection() {
  return (
    <section aria-labelledby="contact-heading">
      <SectionLabel>Contact</SectionLabel>
      <div className="flex items-center gap-8">
        {CONTACTS.map((c) => (
          <a
            key={c.href}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="contact-link flex items-center gap-2 text-sm transition-colors hover:underline"
            style={{ textUnderlineOffset: "3px" }}
          >
            {c.icon}
            {c.display}
          </a>
        ))}
      </div>
    </section>
  );
}
