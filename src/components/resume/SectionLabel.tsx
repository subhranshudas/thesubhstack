interface SectionLabelProps {
  children: React.ReactNode;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="mb-4">
      <h2
        className="font-mono text-xs font-semibold tracking-widest uppercase"
        style={{ color: "var(--accent-primary)" }}
      >
        {children}
      </h2>
      <div
        className="h-px mt-2"
        style={{ background: "var(--border-dim)" }}
        aria-hidden="true"
      />
    </div>
  );
}
