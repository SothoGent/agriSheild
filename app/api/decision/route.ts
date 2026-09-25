import { NextRequest, NextResponse } from "next/server";
import { ZONES } from "@/lib/zones";
import { POLICIES, INSURER } from "@/lib/insurer";
import { evaluateZone, summariseZone } from "@/lib/policy-engine";
import { fetchNasaData } from "@/lib/nasa";
import { computeRisk } from "@/lib/risk";

/**
 * Full decision pipeline for a single zone:
 *   1. Fetch 30 days of NASA POWER climate data
 *   2. Run the XGBoost model to produce a risk score
 *   3. Hand the score to the policy engine
 *   4. Return the model signal AND the insurer's decisions
 *
 * The two outputs are kept strictly separate in the response.
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zoneId = searchParams.get("zone");
  const zone = ZONES.find((z) => z.id === zoneId);
  if (!zone) {
    return NextResponse.json({ error: "Unknown zone" }, { status: 400 });
  }

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");

  try {
    const points = await fetchNasaData(zone.lat, zone.lon, fmt(start), fmt(end));
    const risk = await computeRisk(points);

    const decisions = evaluateZone(POLICIES, zone.id, risk.score);
    const summary = summariseZone(decisions, risk.score, zone.id);

    return NextResponse.json({
      insurer: INSURER,
      zone,
      model: {
        riskScore: risk.score,
        source: risk.source,
        features: risk.features,
        dryDays: risk.dryDays,
        totalRain: risk.totalRain,
        avgTmax: risk.avgTmax,
        consecutiveDry: risk.consecutiveDry,
      },
      policyEngine: {
        decisions,
        summary,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Decision pipeline failed", detail: String(err) },
      { status: 500 }
    );
  }
}
