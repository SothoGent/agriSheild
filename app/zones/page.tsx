"use client";

import TopNav from "@/components/TopNav";
import StatCard from "@/components/StatCard";
import ZoneCard from "@/components/ZoneCard";
import { ZONES } from "@/lib/zones";

export default function ZonesPage() {
  const totalFarmers = ZONES.reduce((s, z) => s + z.farmersEnrolled, 0);
  const totalPolicies = ZONES.reduce((s, z) => s + z.policiesActive, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1 p-10">
        <div className="mb-10">
          <div className="mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
            ZONE MONITORING
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
            Portfolio overview
          </h1>
          <p className="text-sm" style={{ color: "var(--fg-dim)" }}>
            Environmental evidence from NASA POWER, evaluated every 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5 mb-10">
          <StatCard label="Farmers enrolled" value={totalFarmers.toLocaleString()} accent="var(--accent)" />
          <StatCard label="Active policies" value={totalPolicies.toLocaleString()} accent="var(--nominal)" />
          <StatCard label="Coverage zones" value={String(ZONES.length)} accent="var(--warn)" />
          <StatCard label="USSD registrations" value="2,418" accent="var(--accent)" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {ZONES.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </main>
    </div>
  );
}
