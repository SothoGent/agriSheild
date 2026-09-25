"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { useReviews } from "@/lib/review-store";

const ROWS = [
  { ts: "2026-09-24T06:00:12Z", zone: "chiwundura", model: "xgb-v1.0", score: "0.74", rule: "threshold >= 0.68", action: "TRIGGER" },
  { ts: "2026-09-23T06:00:08Z", zone: "gweru-rural", model: "xgb-v1.0", score: "0.61", rule: "threshold >= 0.65", action: "HOLD" },
  { ts: "2026-09-22T06:00:14Z", zone: "zhombe", model: "xgb-v1.0", score: "0.58", rule: "threshold >= 0.68", action: "HOLD" },
  { ts: "2026-09-21T06:00:11Z", zone: "mberengwa", model: "xgb-v1.0", score: "0.52", rule: "threshold >= 0.73", action: "HOLD" },
];

export default function AuditPage() {
  const { reviews } = useReviews();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const reviewList = Object.values(reviews).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        <div className="mb-10">
          <div className="mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
            AUDIT TRAIL
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
            Every trigger, every input, every rule, every review
          </h1>
          <p className="text-sm" style={{ color: "var(--fg-dim)" }}>
            Immutable log of model output, rule evaluation, and underwriter decisions.
          </p>
        </div>

        {/* Model + rule events */}
        <div className="mb-10">
          <div className="mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
            MODEL + RULE EVENTS
          </div>
          <div className="panel" style={{ overflow: "hidden" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-elevated)" }}>
                  {["TIMESTAMP", "ZONE", "MODEL", "SCORE", "RULE", "ACTION"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 mono text-[9px] tracking-widest"
                      style={{ color: "var(--fg-dimmer)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>{r.ts}</td>
                    <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg)" }}>{r.zone}</td>
                    <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>{r.model}</td>
                    <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg)" }}>{r.score}</td>
                    <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>{r.rule}</td>
                    <td
                      className="px-5 py-4 mono text-[9px] tracking-widest"
                      style={{ color: r.action === "TRIGGER" ? "var(--alert)" : "var(--fg-dimmer)" }}
                    >
                      {r.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Underwriter reviews */}
        <div>
          <div className="mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
            UNDERWRITER REVIEWS ({reviewList.length})
          </div>

          {hydrated && reviewList.length === 0 && (
            <div className="panel p-8 text-center">
              <div className="mono text-[10px] tracking-widest mb-2" style={{ color: "var(--fg-dimmer)" }}>
                NO REVIEWS RECORDED
              </div>
              <div className="mono text-[11px]" style={{ color: "var(--fg-dim)" }}>
                Open the insurer cockpit and review a decision to generate an audit event.
              </div>
            </div>
          )}

          {reviewList.length > 0 && (
            <div className="panel" style={{ overflow: "hidden" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    {["TIMESTAMP", "POLICY", "REVIEWER", "OUTCOME", "ENGINE", "SCORE", "COMMENT"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 mono text-[9px] tracking-widest"
                        style={{ color: "var(--fg-dimmer)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviewList.map((r) => (
                    <tr key={r.policyId + r.timestamp} style={{ borderTop: "1px solid var(--border)" }}>
                      <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                        {r.timestamp.replace("T", " ").slice(0, 19)}Z
                      </td>
                      <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg)" }}>
                        {r.policyId}
                      </td>
                      <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg)" }}>
                        {r.reviewer}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="mono text-[9px] tracking-widest"
                          style={{
                            color:
                              r.outcome === "VERIFIED"
                                ? "var(--nominal)"
                                : "var(--alert)",
                          }}
                        >
                          {r.outcome}
                        </span>
                      </td>
                      <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                        {r.snapshot.engineOutcome}
                      </td>
                      <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--accent)" }}>
                        {r.snapshot.modelScore.toFixed(3)}
                      </td>
                      <td className="px-5 py-4 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                        {r.comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
