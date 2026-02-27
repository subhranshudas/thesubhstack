import SectionLabel from "./SectionLabel";

export interface Skill {
  category: string;
  items: string[];
}

const SKILLS = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript", "Python"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "FastAPI"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MongoDB"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Docker", "Git", "CI/CD", "Github", "Vercel" ],
  },
  {
    category: "Tools",
    items: ["Cursor", "Postman", "Figma"]
  }
] satisfies Skill[];

export default function SkillsetSection() {
  return (
    <section aria-labelledby="skillset-heading">
      <SectionLabel>Skillset</SectionLabel>
      <div className="flex flex-col gap-5">
        {SKILLS.map(({ category, items }) => (
          <div key={category} className="flex items-start gap-5">
            <div
              className="font-mono text-xs w-24 shrink-0 pt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              $ {category.toLowerCase()}
            </div>
            <ul className="flex flex-wrap gap-2" role="list">
              {items.map((skill) => (
                <li
                  key={skill}
                  className="text-sm px-2 py-0.5 rounded"
                  style={{
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-default)",
                    backgroundColor: "var(--bg-elevated)",
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
