"use client";

import { useEffect, useState } from "react";

export default function MapHud() {
  const [clock, setClock] = useState("--:--:--");
  const [coords, setCoords] = useState({ lat: -19.0154, lon: 29.1549 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, "0");
      const mm = String(now.getUTCMinutes()).padStart(2, "0");
      const ss = String(now.getUTCSeconds()).padStart(2, "0");
      setClock(hh + ":" + mm + ":" + ss);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Top-left HUD */}
      <div className="absolute top-4 left-4 z-[1000] panel bracket px-4 py-3">
        <div className="mono text-[10px] tracking-[0.3em] mb-1" style={{ color: "var(--fg-dimmer)" }}>
          AGRISHIELD // THEATRE
        </div>
        <div className="mono text-[13px]" style={{ color: "var(--fg)" }}>
          REPUBLIC OF ZIMBABWE
        </div>
        <div className="mono text-[10px] mt-2" style={{ color: "var(--fg-dim)" }}>
          GRID {coords.lat.toFixed(4)}S {coords.lon.toFixed(4)}E
        </div>
      </div>

      {/* Top-right HUD */}
      <div className="absolute top-4 right-4 z-[1000] panel bracket px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="dot" style={{ background: "var(--nominal)" }} />
          <span className="mono text-[10px] tracking-[0.3em]" style={{ color: "var(--fg-dim)" }}>
            LINK NOMINAL
          </span>
        </div>
        <div className="mono text-[13px] text-right" style={{ color: "var(--fg)" }}>
          {clock} UTC
        </div>
        <div className="mono text-[10px] mt-2 text-right" style={{ color: "var(--fg-dim)" }}>
          AES-256 // SESSION 4429
        </div>
      </div>

      {/* Bottom-left legend */}
      <div className="absolute bottom-4 left-4 z-[1000] panel bracket px-4 py-3">
        <div className="mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
          LEGEND
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="dot" style={{ background: "var(--accent)" }} />
            <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>ZONE NOMINAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="dot" style={{ background: "var(--alert)" }} />
            <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>THRESHOLD CROSSED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="dot" style={{ background: "var(--fg-dim)" }} />
            <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>COMMAND POST</span>
          </div>
        </div>
      </div>

      {/* Bottom-right readout */}
      <div className="absolute bottom-4 right-4 z-[1000] panel bracket px-4 py-3">
        <div className="mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
          SAT FEED
        </div>
        <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
          NASA POWER // 30d
        </div>
        <div className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
          HILLSHADE // ESRI
        </div>
        <div className="mono text-[10px]" style={{ color: "var(--accent)" }}>
          UPDATE 24h
        </div>
      </div>
    </>
  );
}
