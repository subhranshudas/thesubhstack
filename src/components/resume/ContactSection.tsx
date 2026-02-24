import SectionLabel from "./SectionLabel";

const CONTACTS = [
  {
    label: "subhstack@gmail.com",
    href: "mailto:subhstack@gmail.com",
    display: "subhstack@gmail.com",
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/subhstack",
    display: "@subhstack",
  },
];

export default function ContactSection() {
  return (
    <section aria-labelledby="contact-heading">
      <SectionLabel>Contact</SectionLabel>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        Get in touch:{" "}
        {CONTACTS.map((c, i) => (
          <span key={c.href}>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="font-mono transition-colors hover:underline"
              style={{ color: "var(--accent-primary)", textUnderlineOffset: "3px" }}
            >
              {c.display}
            </a>
            {i < CONTACTS.length - 1 && (
              <span style={{ color: "var(--text-muted)" }}> · </span>
            )}
          </span>
        ))}
      </p>
    </section>
  );
}
