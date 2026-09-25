"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, FileText } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Portfolio", icon: LayoutDashboard },
  { href: "/zones", label: "Zones", icon: Map },
  { href: "/audit", label: "Audit trail", icon: FileText },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 p-6 flex flex-col" style={{ borderRight: "1px solid var(--line)" }}>
      <div className="flex items-center gap-2 mb-10">
        <span className="dot" style={{ background: "var(--gd-blue)" }} />
        <span className="dot" style={{ background: "var(--gd-red)" }} />
        <span className="dot" style={{ background: "var(--gd-yellow)" }} />
        <span className="dot" style={{ background: "var(--gd-green)" }} />
        <span className="mono text-xs ml-2" style={{ color: "var(--dim)" }}>AGRISHIELD</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
              style={{
                background: active ? "var(--bg-card)" : "transparent",
                color: active ? "var(--fg)" : "var(--dim)",
                border: active ? "1px solid var(--line)" : "1px solid transparent",
              }}>
              <Icon size={16} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto text-xs" style={{ color: "var(--dim2)" }}>
        <div className="mb-2">USSD simulator</div>
        <div className="mono p-3 rounded" style={{ background: "var(--bg-card)", color: "var(--fg)" }}>*123*1#</div>
      </div>
    </aside>
  );
}
