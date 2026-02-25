import SectionLabel from "./SectionLabel";

export default function AboutSection() {
  return (
    <section aria-labelledby="about-heading" className="p-6 rounded-md border" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-dim)" }}>
      <SectionLabel>About Me</SectionLabel>
      <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Hi! I&apos;m a passionate engineer who loves creating elegant solutions to complex problems.
        I currently specialize in full-stack web development and have an emerging interest in artificial intelligence.
      </p>
    </section>
  );
}
