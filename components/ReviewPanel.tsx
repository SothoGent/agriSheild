"use client";

import { useState } from "react";
import type { Review, ReviewOutcome } from "@/lib/review-store";

type Props = {
  policyId: string;
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
  modelScore: number;
  engineOutcome: string;
  engineReason: string;
  payoutAmount: number;
  existing?: Review;
  onClose: () => void;
  onSubmit: (review: Review) => void;
  onClear: () => void;
};

export default function ReviewPanel(props: Props) {
  const {
    policyId,
    holder,
    nationalId,
    crop,
    hectares,
    sumInsured,
    premium,
    triggerThreshold,
    exitThreshold,
    payoutRatio,
    zoneId,
    modelScore,
    engineOutcome,
    engineReason,
    payoutAmount,
    existing,
    onClose,
    onSubmit,
    onClear,
  } = props;

  const [outcome, setOutcome] = useState<ReviewOutcome>(
    existing?.outcome ?? "VERIFIED"
  );
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [reviewer, setReviewer] = useState(existing?.reviewer ?? "");
  const [error, setError] = useState<string | null>(null);

  const outcomeColor =
    engineOutcome === "TRIGGER"
      ? "var(--alert)"
      : engineOutcome === "OBSERVE"
      ? "var(--warn)"
      : "var(--fg-dim)";

  const submit = () => {
    if (!reviewer.trim()) {
      setError("Reviewer name is required.");
      return;
    }
    if (comment.trim().length < 4) {
      setError("Comment is required (at least 4 characters).");
      return;
    }
    onSubmit({
      policyId,
      outcome,
      comment: comment.trim(),
      reviewer: reviewer.trim(),
      timestamp: new Date().toISOString(),
      snapshot: {
        engineOutcome,
        modelScore,
        payoutAmount,
        triggerThreshold,
      },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[2000]"
        style={{ background: "rgba(0,0,0,0.6)" }}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-[2001] flex flex-col"
        style={{
          width: 520,
          background: "var(--bg-panel)",
          borderLeft: "1px solid var(--border-bright)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <div className="mono text-[9px] tracking-[0.3em] mb-1" style={{ color: "var(--fg-dimmer)" }}>
              REVIEW DECISION
            </div>
            <div className="mono text-[13px]" style={{ color: "var(--fg)" }}>
              {policyId}
            </div>
          </div>
          <button
            onClick={onClose}
            className="mono text-[11px] tracking-widest px-3 py-1 border"
            style={{ color: "var(--fg-dim)", borderColor: "var(--border)" }}
          >
            CLOSE
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Policy */}
          <Section label="POLICY">
            <Row k="HOLDER" v={holder} />
            <Row k="NATIONAL ID" v={nationalId} />
            <Row k="CROP" v={crop + " // " + hectares + " ha"} />
            <Row k="ZONE" v={zoneId.toUpperCase()} />
          </Section>

          <Section label="COVERAGE">
            <Row k="SUM INSURED" v={"US$ " + sumInsured} />
            <Row k="PREMIUM" v={"US$ " + premium.toFixed(2)} />
            <Row k="PAYOUT RATIO" v={(payoutRatio * 100).toFixed(0) + "%"} />
            <Row k="TRIGGER" v={triggerThreshold.toFixed(2)} accent="var(--accent)" />
            <Row k="EXIT" v={exitThreshold.toFixed(2)} />
          </Section>

          <Section label="MODEL SIGNAL">
            <Row k="RISK SCORE" v={modelScore.toFixed(3)} accent="var(--accent)" />
            <Row
              k="THRESHOLD"
              v={triggerThreshold.toFixed(2)}
              accent={modelScore >= triggerThreshold ? "var(--alert)" : "var(--fg-dim)"}
            />
          </Section>

          <Section label="ENGINE DECISION">
            <Row k="OUTCOME" v={engineOutcome} accent={outcomeColor} />
            <Row
              k="PAYOUT"
              v={payoutAmount > 0 ? "US$ " + payoutAmount : "—"}
              accent={payoutAmount > 0 ? "var(--alert)" : "var(--fg-dim)"}
            />
            <div
              className="mono text-[10px] leading-relaxed mt-3 pt-3 border-t"
              style={{ color: "var(--fg-dim)", borderColor: "var(--border)" }}
            >
              {engineReason}
            </div>
          </Section>

          {/* Review form */}
          <Section label="UNDERWRITER REVIEW">
            <div className="mb-4">
              <div className="mono text-[9px] tracking-[0.25em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
                OUTCOME
              </div>
              <div className="flex gap-2">
                <ToggleButton
                  active={outcome === "VERIFIED"}
                  onClick={() => setOutcome("VERIFIED")}
                  color="var(--nominal)"
                  label="VERIFY"
                />
                <ToggleButton
                  active={outcome === "DISPUTED"}
                  onClick={() => setOutcome("DISPUTED")}
                  color="var(--alert)"
                  label="DISPUTE"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="mono text-[9px] tracking-[0.25em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
                REVIEWER
              </div>
              <input
                value={reviewer}
                onChange={(e) => {
                  setReviewer(e.target.value);
                  setError(null);
                }}
                placeholder="Full name"
                className="w-full mono text-[12px] px-3 py-2 outline-none"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                }}
              />
            </div>

            <div className="mb-2">
              <div className="mono text-[9px] tracking-[0.25em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
                COMMENT
              </div>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setError(null);
                }}
                placeholder="Reason for verification or dispute"
                rows={4}
                className="w-full mono text-[12px] px-3 py-2 outline-none"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--fg)",
                  resize: "vertical",
                }}
              />
            </div>

            {error && (
              <div className="mono text-[10px] mt-2" style={{ color: "var(--alert)" }}>
                {error}
              </div>
            )}
          </Section>

          {existing && (
            <div
              className="panel mt-4 p-3"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div className="mono text-[9px] tracking-[0.25em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
                PRIOR REVIEW
              </div>
              <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                {existing.outcome} by {existing.reviewer}
              </div>
              <div className="mono text-[10px] mt-1" style={{ color: "var(--fg-dimmer)" }}>
                {existing.timestamp.replace("T", " ").slice(0, 19)}Z
              </div>
              <div className="mono text-[10px] mt-2" style={{ color: "var(--fg-dim)" }}>
                {existing.comment}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex gap-2"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={submit}
            className="mono text-[10px] tracking-[0.25em] px-4 py-2 flex-1"
            style={{
              background: outcome === "DISPUTED" ? "var(--alert)" : "var(--nominal)",
              color: "#000",
            }}
          >
            {outcome === "VERIFIED" ? "SUBMIT VERIFICATION" : "SUBMIT DISPUTE"}
          </button>

          {existing && (
            <button
              onClick={onClear}
              className="mono text-[10px] tracking-[0.25em] px-4 py-2"
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--fg-dim)",
              }}
            >
              CLEAR
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({
  k,
  v,
  accent = "var(--fg)",
}: {
  k: string;
  v: string;
  accent?: string;
}) {
  return (
    <div className="flex justify-between items-baseline py-1">
      <span className="mono text-[10px] tracking-[0.15em]" style={{ color: "var(--fg-dimmer)" }}>
        {k}
      </span>
      <span className="mono text-[11px]" style={{ color: accent }}>
        {v}
      </span>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  color,
  label,
}: {
  active: boolean;
  onClick: () => void;
  color: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 mono text-[10px] tracking-[0.25em] py-2"
      style={{
        background: active ? color : "transparent",
        color: active ? "#000" : "var(--fg-dim)",
        border: "1px solid " + (active ? color : "var(--border)"),
      }}
    >
      {label}
    </button>
  );
}
