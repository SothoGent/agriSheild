import { NextRequest, NextResponse } from "next/server";
import { fetchNasaData } from "@/lib/nasa";
import { computeRisk } from "@/lib/risk";
import { ZONES } from "@/lib/zones";

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
    return NextResponse.json({ zone, points, risk });
  } catch (err) {
    return NextResponse.json(
      { error: "NASA fetch failed", detail: String(err) },
      { status: 500 }
    );
  }
}
