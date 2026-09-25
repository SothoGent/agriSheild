export default function StatCard({
  label,
  value,
  accent = "var(--accent)",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="panel bracket p-5 relative">
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: accent,
        }}
      />
      <div className="mono text-[9px] tracking-[0.25em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
        {label.toUpperCase()}
      </div>
      <div className="mono text-2xl font-semibold" style={{ color: "var(--fg)" }}>
        {value}
      </div>
    </div>
  );
}
