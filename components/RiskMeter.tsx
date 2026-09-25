export default function RiskMeter({ score, threshold }: { score: number; threshold: number }) {
  const pct = Math.min(score, 1) * 100;
  const above = score >= threshold;
  const color = above ? "var(--gd-red)" : "var(--success)";
  return (
    <div>
      <div className="flex justify-between text-xs mb-2" style={{ color: "var(--dim)" }}>
        <span>Drought risk</span>
        <span className="mono" style={{ color: "var(--fg)" }}>{score.toFixed(2)} / {threshold.toFixed(2)}</span>
      </div>
      <div style={{ height: 6, background: "var(--bg-light)", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: color, transition: "width 400ms ease" }} />
      </div>
      <div className="text-xs mt-2 mono" style={{ color: above ? "var(--gd-red)" : "var(--dim2)" }}>
        {above ? "THRESHOLD CROSSED - TRIGGER FIRED" : "Below threshold"}
      </div>
    </div>
  );
}
