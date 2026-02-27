interface SectionCardProps {
  children: React.ReactNode;
}

export default function SectionCard({ children }: SectionCardProps) {
  return (
    <div
      className="rounded-md border p-6"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-dim)",
      }}
    >
      {children}
    </div>
  );
}
