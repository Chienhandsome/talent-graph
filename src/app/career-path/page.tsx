import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  GitFork,
  Layers3,
  Network,
  Route,
  Sparkles,
} from "lucide-react";

import { CareerPathExplorer } from "@/features/career-path/components/career-path-explorer";

export const metadata: Metadata = {
  title: "Career Path Explorer | TalentGraph",
  description:
    "Find realistic role transitions and the skills, resources, and projects that can help you make each move.",
};

export default function CareerPathPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <GitFork className="size-4" aria-hidden="true" />
            </span>
            <span>TalentGraph</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Product navigation">
            <Link
              href="/skill-gap"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Layers3 className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Skill gap</span>
            </Link>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Network className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">Explorer</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Overview</span>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 30%, rgba(16,185,129,.13), transparent 28%), radial-gradient(circle at 85% 15%, rgba(99,102,241,.11), transparent 25%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Graph-powered career planning
            </div>
            <h1 className="max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              See the moves between where you are and where you want to be.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Compare realistic role transitions, understand which skills carry
              forward, and turn every gap into a focused learning plan.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Route className="size-4 text-emerald-700" aria-hidden="true" />
                Up to 5 ranked paths
              </span>
              <span className="inline-flex items-center gap-2">
                <GitFork className="size-4 text-indigo-700" aria-hidden="true" />
                Bounded at 1–4 transitions
              </span>
            </div>
          </div>
        </div>
      </section>

      <CareerPathExplorer />
    </main>
  );
}
