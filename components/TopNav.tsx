"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "OPERATIONS" },
  { href: "/zones", label: "ZONES" },
  { href: "/insurer", label: "INSURER" },
  { href: "/audit", label: "AUDIT" },
  { href: "/model", label: "MODEL" },
];

export default function TopNav() {
  const path = usePathname();
  return (
    <header
      className="h-14 flex items-center px-6 border-b"
      style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}
    >
      <div className="flex items-center gap-3 mr-10">
        <div className="flex items-center gap-1.5">
          <span className="dot" style={{ background: "#4285F4" }} />
          <span className="dot" style={{ background: "#EA4335" }} />
          <span className="dot" style={{ background: "#FBBC05" }} />
          <span className="dot" style={{ background: "#34A853" }} />
        </div>
        <span className="mono text-[11px] tracking-[0.35em]" style={{ color: "var(--fg)" }}>
          AGRISHIELD
        </span>
      </div>

      <nav className="flex items-center h-full">
        {NAV.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="h-full flex items-center px-5 mono text-[10px] tracking-[0.25em] border-b-2 transition-colors"
              style={{
                color: active ? "var(--fg)" : "var(--fg-dim)",
                borderColor: active ? "var(--accent)" : "transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-6">
        <span className="mono text-[10px]" style={{ color: "var(--fg-dimmer)" }}>
          USSD *123*1#
        </span>
        <div className="flex items-center gap-2">
          <span className="dot" style={{ background: "var(--nominal)" }} />
          <span className="mono text-[10px]" style={{ color: "var(--fg-dim)" }}>
            ONLINE
          </span>
        </div>
      </div>
    </header>
  );
}
