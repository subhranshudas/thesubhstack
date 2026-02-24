import SectionLabel from "./SectionLabel";

// Add projects here as you build them
const PROJECTS: {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  repo?: string;
  status: "live" | "wip" | "archived";
}[] = [];

export default function ProjectsSection() {
  return (
    <section aria-labelledby="projects-heading">
      <SectionLabel>Public Projects</SectionLabel>
      {PROJECTS.length === 0 ? (
        <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>
          Coming soon...
        </p>
      ) : (
        <ul className="space-y-4" role="list">
          {PROJECTS.map((project) => (
            <li
              key={project.name}
              className="rounded-md border p-4"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-dim)" }}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-mono text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 shrink-0">
                  {project.status === "live" && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ color: "var(--accent-primary)", backgroundColor: "var(--accent-subtle)", border: "1px solid var(--accent-dim)" }}>
                      live
                    </span>
                  )}
                  {project.status === "wip" && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ color: "#f59e0b", backgroundColor: "#1c1508", border: "1px solid #78350f" }}>
                      wip
                    </span>
                  )}
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs transition-colors hover:text-accent" style={{ color: "var(--text-muted)" }}>
                      ↗ visit
                    </a>
                  )}
                  {project.repo && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="font-mono text-xs transition-colors hover:text-accent" style={{ color: "var(--text-muted)" }}>
                      ↗ repo
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                {project.description}
              </p>
              <ul className="flex flex-wrap gap-1.5" role="list">
                {project.tech.map((t) => (
                  <li key={t} className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border-dim)" }}>
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
