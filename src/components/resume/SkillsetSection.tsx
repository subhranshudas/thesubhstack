import SectionLabel from "./SectionLabel";

const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["JavaScript / TypeScript", "Python"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js / Express", "FastAPI"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Docker", "Git / CI/CD"],
  },
];

export default function SkillsetSection() {
  return (
    <section aria-labelledby="skillset-heading">
      <SectionLabel>Skillset</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SKILLS.map(({ category, items }) => (
          <div
            key={category}
            className="rounded-md border px-4 py-3"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-dim)" }}
          >
            <div className="font-mono text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              {category}
            </div>
            <ul className="flex flex-wrap gap-2" role="list">
              {items.map((skill) => (
                <li
                  key={skill}
                  className="font-mono text-xs px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
