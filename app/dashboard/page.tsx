"use client";

import dynamic from "next/dynamic";
import TopNav from "@/components/TopNav";
import TelemetryRail from "@/components/TelemetryRail";
import MapHud from "@/components/MapHud";
import RadarSweep from "@/components/RadarSweep";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="mono text-[11px] tracking-[0.3em]" style={{ color: "var(--fg-dim)" }}>
        INITIALISING THEATRE...
      </div>
    </div>
  ),
});

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <TopNav />

      <div className="flex flex-1 overflow-hidden">
        {/* Map canvas */}
        <div className="flex-1 relative" style={{ background: "#050506" }}>
          <MapView />
          <RadarSweep />
          <MapHud />
        </div>

        {/* Right rail */}
        <TelemetryRail />
      </div>

      {/* Bottom status bar */}
      <div
        className="h-8 flex items-center px-4 gap-6 border-t"
        style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}
      >
        <span className="mono text-[10px]" style={{ color: "var(--fg-dimmer)" }}>
          AGRISHIELD C2 // v1.0.0
        </span>
        <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
          ZONES 4
        </span>
        <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
          FARMERS 16,200
        </span>
        <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
          POLICIES 15,350
        </span>
        <span className="ml-auto mono text-[10px]" style={{ color: "var(--nominal)" }}>
          ● ALL SYSTEMS NOMINAL
        </span>
      </div>
    </div>
  );
}
