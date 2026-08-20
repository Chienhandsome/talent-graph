import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  GitFork,
  Network,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import { SkillGapExplorer } from "@/features/skill-gap/components/skill-gap-explorer";

export const metadata: Metadata = {
  title: "Skill Gap Analysis | TalentGraph",
  description:
    "Compare your current skills with a target role and get a focused, ranked learning plan.",
};

export default function SkillGapPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-4"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <GitFork className="size-4" aria-hidden="true" />
            </span>
            <span>TalentGraph</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Product navigation">
            <Link
              href="/career-path"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <Route className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Career paths</span>
            </Link>
            <Link
              href="/explorer"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <Network className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">Explorer</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Overview</span>
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 25%, rgba(99,102,241,.14), transparent 28%), radial-gradient(circle at 82% 18%, rgba(16,185,129,.11), transparent 25%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-800 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Focused skill-gap analysis
            </div>
            <h1 className="max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              Know exactly what stands between you and your next role.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Compare the skills you already use with a target role, then turn
              the most important gaps into a practical learning sequence.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Target className="size-4 text-indigo-700" aria-hidden="true" />
                Importance-weighted readiness
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-700" aria-hidden="true" />
                Top 5 next skills
              </span>
            </div>
          </div>
        </div>
      </section>

      <SkillGapExplorer />
    </main>
  );
}
