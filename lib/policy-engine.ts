/**
 * Policy engine. Evaluates each policy against the model score for its zone.
 *
 * This is where the separation is enforced. The model has already produced
 * a score. The insurer's rules now decide what happens. The model cannot
 * decide a payout. Only a policy rule can.
 */

import type { Policy } from "./insurer";

export type DecisionOutcome = "TRIGGER" | "HOLD" | "OBSERVE" | "LAPSED";

export type Decision = {
  policy: Policy;
  modelScore: number;
  outcome: DecisionOutcome;
  payoutAmount: number;
  reason: string;
  evaluatedAt: string;
};

export function evaluatePolicy(
  policy: Policy,
  modelScore: number
): Decision {
  const evaluatedAt = new Date().toISOString();

  if (policy.status !== "ACTIVE") {
    return {
      policy,
      modelScore,
      outcome: "LAPSED",
      payoutAmount: 0,
      reason: "Policy is not active. No evaluation performed.",
      evaluatedAt,
    };
  }

  // Rule 1: above trigger threshold -> payout
  if (modelScore >= policy.triggerThreshold) {
    return {
      policy,
      modelScore,
      outcome: "TRIGGER",
      payoutAmount: Math.round(policy.sumInsured * policy.payoutRatio),
      reason:
        "Model score " +
        modelScore.toFixed(3) +
        " >= trigger " +
        policy.triggerThreshold.toFixed(2) +
        ". Contractual condition satisfied.",
      evaluatedAt,
    };
  }

  // Rule 2: between exit and trigger -> observe (no payout, watch)
  if (modelScore >= policy.exitThreshold) {
    return {
      policy,
      modelScore,
      outcome: "OBSERVE",
      payoutAmount: 0,
      reason:
        "Model score " +
        modelScore.toFixed(3) +
        " between exit " +
        policy.exitThreshold.toFixed(2) +
        " and trigger " +
        policy.triggerThreshold.toFixed(2) +
        ". Watch condition. No payout.",
      evaluatedAt,
    };
  }

  // Rule 3: below exit threshold -> hold
  return {
    policy,
    modelScore,
    outcome: "HOLD",
    payoutAmount: 0,
    reason:
      "Model score " +
      modelScore.toFixed(3) +
      " below exit " +
      policy.exitThreshold.toFixed(2) +
      ". No drought condition. No payout.",
    evaluatedAt,
  };
}

export function evaluateZone(
  policies: Policy[],
  zoneId: string,
  modelScore: number
): Decision[] {
  return policies
    .filter((p) => p.zoneId === zoneId)
    .map((p) => evaluatePolicy(p, modelScore));
}

export type ZoneSummary = {
  zoneId: string;
  modelScore: number;
  totalPolicies: number;
  triggered: number;
  observing: number;
  held: number;
  totalExposure: number;
  totalPayout: number;
};

export function summariseZone(decisions: Decision[], modelScore: number, zoneId: string): ZoneSummary {
  const triggered = decisions.filter((d) => d.outcome === "TRIGGER").length;
  const observing = decisions.filter((d) => d.outcome === "OBSERVE").length;
  const held = decisions.filter((d) => d.outcome === "HOLD").length;
  const exposure = decisions.reduce((s, d) => s + d.policy.sumInsured, 0);
  const payout = decisions.reduce((s, d) => s + d.payoutAmount, 0);

  return {
    zoneId,
    modelScore,
    totalPolicies: decisions.length,
    triggered,
    observing,
    held,
    totalExposure: exposure,
    totalPayout: payout,
  };
}
