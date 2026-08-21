"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitFork, Layers3, Network, Route } from "lucide-react";

import { cn } from "@/lib/utils";

const productLinks = [
  {
    href: "/career-path",
    label: "Career paths",
    icon: Route,
    activeClass: "bg-emerald-700 text-white shadow-sm",
    hoverClass: "hover:bg-emerald-50 hover:text-emerald-800",
  },
  {
    href: "/skill-gap",
    label: "Skill gap",
    icon: Layers3,
    activeClass: "bg-indigo-700 text-white shadow-sm",
    hoverClass: "hover:bg-indigo-50 hover:text-indigo-800",
  },
  {
    href: "/explorer",
    label: "Explorer",
    icon: Network,
    activeClass: "bg-cyan-700 text-white shadow-sm",
    hoverClass: "hover:bg-cyan-50 hover:text-cyan-800",
  },
] as const;

export function ProductHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:min-h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-0 lg:px-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 font-semibold tracking-tight text-slate-950 outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-4"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <GitFork className="size-4" aria-hidden="true" />
          </span>
          <span>TalentGraph</span>
        </Link>

        <nav
          className="grid w-full grid-cols-3 gap-1 sm:w-auto sm:flex sm:items-center"
          aria-label="Product navigation"
        >
          {productLinks.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2 sm:gap-2 sm:px-3 sm:text-sm",
                  active
                    ? item.activeClass
                    : cn("text-slate-600", item.hoverClass),
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
