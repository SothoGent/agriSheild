"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import ReviewPanel from "@/components/ReviewPanel";
import { ZONES } from "@/lib/zones";
import { INSURER } from "@/lib/insurer";
import { useReviews, Review } from "@/lib/review-store";

type Decision = {
  policy: {
    id: string;
    holder: string;
    nationalId: string;
    crop: string;
    hectares: number;
    sumInsured: number;
    premium: number;
    triggerThreshold: number;
    exitThreshold: number;
    payoutRatio: number;
    zoneId: string;
  };
  modelScore: number;
  outcome: "TRIGGER" | "HOLD" | "OBSERVE" | "LAPSED";
  payoutAmount: number;
  reason: string;
  evaluatedAt: string;
};

type ZoneResponse = {
  model: { riskScore: number; source: string };
  policyEngine: {
    decisions: Decision[];
    summary: {
      totalPolicies: number;
      triggered: number;
      observing: number;
      held: number;
      totalExposure: number;
      totalPayout: number;
    };
  };
};

export default function InsurerPage() {
  const [selected, setSelected] = useState(ZONES[0].id);
  const [data, setData] = useState<ZoneResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<Decision | null>(null);

  const { reviews, hydrated, addReview, clearReview, clearAll } = useReviews();

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch("/api/decision?zone=" + selected)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [selected]);

  const zone = ZONES.find((z) => z.id === selected)!;

  // Reviews applicable to the current view
  const visibleReviews = data
    ? data.policyEngine.decisions
        .map((d) => reviews[d.policy.id])
        .filter(Boolean)
    : [];

  const verifiedCount = visibleReviews.filter((r) => r.outcome === "VERIFIED").length;
  const disputedCount = visibleReviews.filter((r) => r.outcome === "DISPUTED").length;
  const pendingCount = data
    ? data.policyEngine.decisions.length - visibleReviews.length
    : 0;

  const submitReview = (r: Review) => {
    addReview(r);
    setReviewing(null);
  };

  const clearOneReview = (policyId: string) => {
    clearReview(policyId);
    setReviewing(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
              INSURER COCKPIT
            </div>
            <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
              {INSURER.name}
            </h1>
            <div className="mono text-[11px]" style={{ color: "var(--fg-dim)" }}>
              REGULATOR {INSURER.regulator} // LICENSE {INSURER.licenseNumber}
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="panel bracket px-5 py-3">
              <div className="mono text-[9px] tracking-[0.25em] mb-1" style={{ color: "var(--fg-dimmer)" }}>
                REVIEWS THIS SESSION
              </div>
              <div className="flex gap-5">
                <div>
                  <div className="mono text-[15px]" style={{ color: "var(--nominal)" }}>
                    {verifiedCount}
                  </div>
                  <div className="mono text-[8px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
                    VERIFIED
                  </div>
                </div>
                <div>
                  <div className="mono text-[15px]" style={{ color: "var(--alert)" }}>
                    {disputedCount}
                  </div>
                  <div className="mono text-[8px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
                    DISPUTED
                  </div>
                </div>
                <div>
                  <div className="mono text-[15px]" style={{ color: "var(--fg-dim)" }}>
                    {pendingCount}
                  </div>
                  <div className="mono text-[8px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
                    PENDING
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(reviews).length > 0 && (
              <button
                onClick={clearAll}
                className="panel px-4 py-3 mono text-[9px] tracking-[0.25em]"
                style={{ color: "var(--fg-dim)", borderColor: "var(--border)" }}
              >
                CLEAR ALL
              </button>
            )}
          </div>
        </div>

        {/* Zone selector */}
        <div className="flex gap-2 mb-8">
          {ZONES.map((z) => {
            const active = z.id === selected;
            return (
              <button
                key={z.id}
                onClick={() => setSelected(z.id)}
                className="panel px-4 py-2 mono text-[10px] tracking-[0.2em]"
                style={{
                  background: active ? "var(--bg-elevated)" : "var(--bg-panel)",
                  color: active ? "var(--fg)" : "var(--fg-dim)",
                  borderColor: active ? "var(--accent)" : "var(--border)",
                }}
              >
                {z.name.toUpperCase()}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mono text-[11px] tracking-[0.2em]" style={{ color: "var(--fg-dim)" }}>
            RUNNING PIPELINE...
          </div>
        )}

        {data && (
          <>
            {/* Top three cards */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="panel bracket p-6">
                <div className="mono text-[9px] tracking-[0.25em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
                  MODEL OUTPUT
                </div>
                <div className="mono text-4xl mb-2" style={{ color: "var(--accent)" }}>
                  {data.model.riskScore.toFixed(3)}
                </div>
                <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                  source: {data.model.source}
                </div>
                <div className="mono text-[10px] mt-3 pt-3 border-t leading-relaxed" style={{ color: "var(--fg-dimmer)", borderColor: "var(--border)" }}>
                  The model produces a risk signal.<br />
                  It does not decide payouts.
                </div>
              </div>

              <div className="panel bracket p-6">
                <div className="mono text-[9px] tracking-[0.25em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
                  POLICY BOOK
                </div>
                <div className="mono text-4xl mb-2" style={{ color: "var(--fg)" }}>
                  {data.policyEngine.summary.totalPolicies}
                </div>
                <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                  active policies in {zone.name}
                </div>
                <div className="mono text-[10px] mt-3 pt-3 border-t" style={{ color: "var(--fg-dimmer)", borderColor: "var(--border)" }}>
                  Total exposure: US$ {data.policyEngine.summary.totalExposure.toLocaleString()}
                </div>
              </div>

              <div className="panel bracket p-6">
                <div className="mono text-[9px] tracking-[0.25em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
                  INSURER DECISION
                </div>
                <div
                  className="mono text-4xl mb-2"
                  style={{
                    color:
                      data.policyEngine.summary.triggered > 0
                        ? "var(--alert)"
                        : "var(--nominal)",
                  }}
                >
                  {data.policyEngine.summary.triggered}
                </div>
                <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                  policies triggered for payout
                </div>
                <div className="mono text-[10px] mt-3 pt-3 border-t" style={{ color: "var(--fg-dimmer)", borderColor: "var(--border)" }}>
                  Payout obligation: US$ {data.policyEngine.summary.totalPayout.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Decision queue */}
            <div className="panel bracket">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <div>
                  <div className="mono text-[9px] tracking-[0.3em]" style={{ color: "var(--fg-dimmer)" }}>
                    DECISION QUEUE
                  </div>
                  <div className="mono text-[11px] mt-1" style={{ color: "var(--fg-dim)" }}>
                    Every policy evaluated against the model signal by rule.
                    Underwriter review is the final word.
                  </div>
                </div>
                <div className="mono text-[10px] tracking-widest flex gap-6">
                  <span style={{ color: "var(--alert)" }}>TRIGGER {data.policyEngine.summary.triggered}</span>
                  <span style={{ color: "var(--warn)" }}>OBSERVE {data.policyEngine.summary.observing}</span>
                  <span style={{ color: "var(--fg-dim)" }}>HOLD {data.policyEngine.summary.held}</span>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    {["POLICY", "HOLDER", "CROP", "COVERAGE", "TRIGGER", "MODEL", "OUTCOME", "PAYOUT", "REVIEW", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 mono text-[9px] tracking-widest"
                        style={{ color: "var(--fg-dimmer)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.policyEngine.decisions.map((d) => {
                    const review = reviews[d.policy.id];
                    const outcomeColor =
                      d.outcome === "TRIGGER"
                        ? "var(--alert)"
                        : d.outcome === "OBSERVE"
                        ? "var(--warn)"
                        : d.outcome === "LAPSED"
                        ? "var(--fg-dimmer)"
                        : "var(--fg-dim)";
                    return (
                      <tr key={d.policy.id} style={{ borderTop: "1px solid var(--border)" }}>
                        <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--fg)" }}>
                          {d.policy.id}
                        </td>
                        <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--fg)" }}>
                          {d.policy.holder}
                        </td>
                        <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                          {d.policy.crop} // {d.policy.hectares} ha
                        </td>
                        <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--fg)" }}>
                          US$ {d.policy.sumInsured}
                        </td>
                        <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                          {d.policy.triggerThreshold.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 mono text-[10px]" style={{ color: "var(--accent)" }}>
                          {d.modelScore.toFixed(3)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="mono text-[9px] tracking-widest" style={{ color: outcomeColor }}>
                            {d.outcome}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 mono text-[10px]"
                          style={{ color: d.payoutAmount > 0 ? "var(--alert)" : "var(--fg-dimmer)" }}
                        >
                          {d.payoutAmount > 0 ? "US$ " + d.payoutAmount : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {review ? (
                            <span
                              className="mono text-[9px] tracking-widest"
                              style={{
                                color:
                                  review.outcome === "VERIFIED"
                                    ? "var(--nominal)"
                                    : "var(--alert)",
                              }}
                            >
                              {review.outcome}
                            </span>
                          ) : (
                            <span className="mono text-[9px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setReviewing(d)}
                            className="mono text-[9px] tracking-widest px-2 py-1 border"
                            style={{
                              color: review ? "var(--fg-dim)" : "var(--accent)",
                              borderColor: review ? "var(--border)" : "var(--accent)",
                            }}
                          >
                            {review ? "REVIEW" : "REVIEW"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Rule trace for first decision */}
            <div className="mt-6 panel bracket p-6">
              <div className="mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
                RULE TRACE // {data.policyEngine.decisions[0]?.policy.id}
              </div>
              <div className="mono text-[11px] leading-relaxed" style={{ color: "var(--fg-dim)" }}>
                {data.policyEngine.decisions[0]?.reason}
              </div>
            </div>
          </>
        )}
      </main>

      {reviewing && (
        <ReviewPanel
          policyId={reviewing.policy.id}
          holder={reviewing.policy.holder}
          nationalId={reviewing.policy.nationalId}
          crop={reviewing.policy.crop}
          hectares={reviewing.policy.hectares}
          sumInsured={reviewing.policy.sumInsured}
          premium={reviewing.policy.premium}
          triggerThreshold={reviewing.policy.triggerThreshold}
          exitThreshold={reviewing.policy.exitThreshold}
          payoutRatio={reviewing.policy.payoutRatio}
          zoneId={reviewing.policy.zoneId}
          modelScore={reviewing.modelScore}
          engineOutcome={reviewing.outcome}
          engineReason={reviewing.reason}
          payoutAmount={reviewing.payoutAmount}
          existing={reviews[reviewing.policy.id]}
          onClose={() => setReviewing(null)}
          onSubmit={submitReview}
          onClear={() => clearOneReview(reviewing.policy.id)}
        />
      )}
    </div>
  );
}
