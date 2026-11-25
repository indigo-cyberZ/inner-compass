"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/today", label: "Today", icon: "☀️" },
  { href: "/journal", label: "Journal", icon: "📓" },
  { href: "/explore", label: "Explore", icon: "🧭" },
  { href: "/learn", label: "Learn", icon: "📚" },
  { href: "/insights", label: "Insights", icon: "🌱" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-10 border-t border-line bg-surface/90 backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-between px-2">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition ${
                  active ? "text-clay" : "text-ink-soft"
                }`}
              >
                <span aria-hidden className="text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden w-56 shrink-0 flex-col gap-1 border-r border-line bg-surface px-3 py-6 md:flex"
    >
      <div className="mb-6 flex items-center gap-2 px-3">
        <span aria-hidden className="text-2xl">
          🧭
        </span>
        <span className="font-bold text-ink">Inner Compass</span>
      </div>
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-clay/15 text-clay"
                : "text-ink-soft hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
