"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/cadastros", label: "Cadastros" },
  { href: "/doacoes", label: "Doações" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 text-sm text-slate-300">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-1.5 transition ${
              active
                ? "bg-cyan-500/20 text-cyan-200"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
