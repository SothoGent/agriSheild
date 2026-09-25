"use client";

import { useEffect, useState } from "react";
import type { Zone } from "@/lib/zones";

type NasaResponse = {
  risk?: {
    score: number;
    dryDays: number;
    totalRain: number;
    avgTmax: number;
    humidity: number;
    consecutiveDry: number;
    source: string;
  };
  error?: string;
};

export default function ZoneCard({ zone }: { zone: Zone }) {
  const [data, setData] = useState<NasaResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/nasa?zone=" + zone.id)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, [zone.id]);

  const risk = data?.risk?.score ?? 0;
  const triggered = risk >= zone.threshold;
  const source = data?.risk?.source ?? "unknown";

  return (
    <div className="panel bracket p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="mono text-[9px] tracking-[0.3em] mb-1" style={{ color: "var(--fg-dimmer)" }}>
            {zone.id.toUpperCase()}
          </div>
          <div className="text-lg font-semibold mb-1" style={{ color: "var(--fg)" }}>
            {zone.name}
          </div>
          <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
            {zone.district} // {zone.lat.toFixed(2)}S {zone.lon.toFixed(2)}E
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="dot" style={{ background: triggered ? "var(--alert)" : "var(--accent)" }} />
          <span
            className="mono text-[9px] tracking-widest"
            style={{ color: triggered ? "var(--alert)" : "var(--fg-dim)" }}
          >
            {triggered ? "TRIGGER" : "NOMINAL"}
          </span>
        </div>
      </div>

      {loading && (
        <div className="mono text-[10px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
          RUNNING INFERENCE...
        </div>
      )}

      {data?.risk && (
        <>
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span className="mono text-[9px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
                XGBOOST RISK
              </span>
              <span className="mono text-[11px]" style={{ color: "var(--fg)" }}>
                {risk.toFixed(3)} / {zone.threshold.toFixed(2)}
              </span>
            </div>
            <div style={{ height: 3, background: "var(--border)" }}>
              <div
                style={{
                  height: "100%",
                  width: Math.min(risk * 100, 100) + "%",
                  background: triggered ? "var(--alert)" : "var(--accent)",
                  transition: "width 400ms ease",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <div>
              <div className="mono text-[9px] tracking-widest mb-1" style={{ color: "var(--fg-dimmer)" }}>
                DRY DAYS
              </div>
              <div className="mono text-sm" style={{ color: "var(--fg)" }}>
                {data.risk.dryDays}
              </div>
            </div>
            <div>
              <div className="mono text-[9px] tracking-widest mb-1" style={{ color: "var(--fg-dimmer)" }}>
                RAIN 30d
              </div>
              <div className="mono text-sm" style={{ color: "var(--fg)" }}>
                {data.risk.totalRain}mm
              </div>
            </div>
            <div>
              <div className="mono text-[9px] tracking-widest mb-1" style={{ color: "var(--fg-dimmer)" }}>
                CONSEC DRY
              </div>
              <div className="mono text-sm" style={{ color: "var(--fg)" }}>
                {data.risk.consecutiveDry}d
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="mono text-[9px] tracking-widest" style={{ color: "var(--fg-dimmer)" }}>
              MODEL
            </span>
            <span className="mono text-[9px] tracking-widest" style={{ color: "var(--accent)" }}>
              {source.toUpperCase()}
            </span>
          </div>
        </>
      )}

      {data?.error && (
        <div className="mono text-[10px]" style={{ color: "var(--alert)" }}>
          {data.error}
        </div>
      )}
    </div>
  );
}
