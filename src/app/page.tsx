import type { Metadata } from "next";
import AboutSection from "@/components/resume/AboutSection";
import SkillsetSection from "@/components/resume/SkillsetSection";
import ProjectsSection from "@/components/resume/ProjectsSection";
import ContactSection from "@/components/resume/ContactSection";
import Link from "next/link";

export const metadata: Metadata = {
  title: "subhstack — Engineering Blog & Portfolio",
  description:
    "Subhranshu — full-stack engineer specializing in TypeScript, React, Python, and cloud infrastructure. Engineering blog and portfolio.",
};

// JSON-LD structured data for the person/website
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.thesubhstack.com/#person",
      name: "Subhranshu",
      url: "https://www.thesubhstack.com",
      sameAs: [
        "https://twitter.com/subhstack",
        "mailto:subhstack@gmail.com",
      ],
      jobTitle: "Full-Stack Engineer",
      knowsAbout: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "AWS",
        "Docker",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.thesubhstack.com/#website",
      url: "https://www.thesubhstack.com",
      name: "thesubhstack",
      author: { "@id": "https://www.thesubhstack.com/#person" },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-20">
        {/* Hero row */}
        <div className="mb-12">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              visitor@subhstack:~$
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--accent-primary)" }}>
              whoami
            </span>
          </div>
          <h1
            className="font-mono text-3xl md:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Subhranshu
          </h1>
          <p className="text-base max-w-xl" style={{ color: "var(--text-secondary)" }}>
            full-stack engineer · blogger · tinkerer.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Link
              href="/blogs"
              className="font-mono text-sm px-4 py-2 rounded border transition-all"
              style={{
                color: "var(--accent-primary)",
                borderColor: "var(--accent-primary)",
                backgroundColor: "var(--accent-subtle)",
              }}
            >
              read the blog →
            </Link>
          </div>
        </div>

        {/* Resume grid */}
        <div className="space-y-8">
          <AboutSection />
          <SkillsetSection />
          <ProjectsSection />
          <ContactSection />
        </div>
      </div>
    </>
  );
}
