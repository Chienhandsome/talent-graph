import Link from "next/link";
import { GitFork, Layers3, Network, Route } from "lucide-react";

const productLinks = [
  { href: "/career-path", label: "Career paths", icon: Route },
  { href: "/explorer", label: "Explorer", icon: Network },
  { href: "/skill-gap", label: "Skill gap", icon: Layers3 },
] as const;

export function ProductHeader() {
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
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 sm:gap-2 sm:px-3 sm:text-sm"
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
