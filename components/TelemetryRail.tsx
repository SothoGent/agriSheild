"use client";

import { useEffect, useState } from "react";
import { ZONES } from "@/lib/zones";

type NasaResponse = {
  risk?: { score: number; dryDays: number; totalRain: number; avgTmax: number };
};

export default function TelemetryRail() {
  const [zoneRisks, setZoneRisks] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState(ZONES[0].id);
  const [detail, setDetail] = useState<NasaResponse | null>(null);

  useEffect(() => {
    ZONES.forEach((zone) => {
      fetch("/api/nasa?zone=" + zone.id)
        .then((r) => r.json())
        .then((d) => {
          if (d?.risk) {
            setZoneRisks((prev) => ({ ...prev, [zone.id]: d.risk.score }));
          }
        })
        .catch(() => {});
    });
  }, []);

  useEffect(() => {
    setDetail(null);
    fetch("/api/nasa?zone=" + selected)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .catch(() => {});
  }, [selected]);

  const zone = ZONES.find((z) => z.id === selected)!;
  const risk = zoneRisks[zone.id] ?? 0;
  const triggered = risk >= zone.threshold;

  return (
    <div className="w-[340px] flex flex-col border-l" style={{ borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mono text-[10px] tracking-[0.3em] mb-1" style={{ color: "var(--fg-dimmer)" }}>
          TELEMETRY
        </div>
        <div className="text-sm font-semibold" style={{ color: "var(--fg)" }}>
          Zone monitoring
        </div>
      </div>

      {/* Zone list */}
      <div className="flex-1 overflow-y-auto">
        {ZONES.map((z) => {
          const r = zoneRisks[z.id];
          const isTriggered = r !== undefined && r >= z.threshold;
          const isSelected = z.id === selected;
          return (
            <button
              key={z.id}
              onClick={() => setSelected(z.id)}
              className="w-full text-left px-5 py-4 border-b transition-colors"
              style={{
                borderColor: "var(--border)",
                background: isSelected ? "var(--bg-elevated)" : "transparent",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="dot"
                    style={{
                      background: isTriggered ? "var(--alert)" : "var(--accent)",
                    }}
                  />
                  <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                    {z.name}
                  </span>
                </div>
                <span className="mono text-[10px]" style={{ color: "var(--fg-dimmer)" }}>
                  {z.id.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
                  RISK {r !== undefined ? r.toFixed(2) : "--"} / {z.threshold.toFixed(2)}
                </span>
                <span
                  className="mono text-[9px] tracking-widest"
                  style={{ color: isTriggered ? "var(--alert)" : "var(--fg-dimmer)" }}
                >
                  {isTriggered ? "TRIGGER" : "NOMINAL"}
                </span>
              </div>
              {/* Mini bar */}
              <div
                style={{
                  height: 2,
                  background: "var(--border)",
                  marginTop: 10,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: Math.min((r ?? 0) * 100, 100) + "%",
                    background: isTriggered ? "var(--alert)" : "var(--accent)",
                    transition: "width 400ms ease",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected zone detail */}
      <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mono text-[10px] tracking-[0.3em] mb-3" style={{ color: "var(--fg-dimmer)" }}>
          DETAIL // {zone.id.toUpperCase()}
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <Metric label="FARMERS" value={zone.farmersEnrolled.toLocaleString()} />
          <Metric label="POLICIES" value={zone.policiesActive.toLocaleString()} />
          <Metric
            label="RISK"
            value={risk ? risk.toFixed(2) : "--"}
            accent={triggered ? "var(--alert)" : "var(--accent)"}
          />
          <Metric
            label="DRY DAYS"
            value={detail?.risk?.dryDays?.toString() ?? "--"}
          />
          <Metric
            label="RAIN 30d"
            value={detail?.risk ? detail.risk.totalRain + "mm" : "--"}
          />
          <Metric
            label="T-MAX"
            value={detail?.risk ? detail.risk.avgTmax + "C" : "--"}
          />
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = "var(--fg)",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="mono text-[9px] tracking-[0.2em] mb-1" style={{ color: "var(--fg-dimmer)" }}>
        {label}
      </div>
      <div className="mono text-[13px]" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
