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

import { GraphExplorer } from "@/features/graph-explorer/components/graph-explorer";

export const metadata: Metadata = {
  title: "Graph Explorer | TalentGraph",
  description:
    "Explore the roles, skills, resources, projects, and relationships inside the TalentGraph career graph.",
};

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-4"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <GitFork className="size-4" aria-hidden="true" />
            </span>
            <span>TalentGraph</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Product navigation">
            <Link
              href="/career-path"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
            >
              <Route className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">Career paths</span>
            </Link>
            <Link
              href="/skill-gap"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
            >
              <Layers3 className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">Skill gap</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">Overview</span>
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
              "radial-gradient(circle at 14% 20%, rgba(8,145,178,.14), transparent 27%), radial-gradient(circle at 82% 22%, rgba(99,102,241,.10), transparent 26%)",
          }}
        />
        <div className="relative mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-900 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Interactive knowledge graph
            </div>
            <h1 className="max-w-3xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              Explore how roles, skills, and learning opportunities connect.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Start from a role, expand one or two hops, then inspect any node
              to understand the relationships around it.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Network className="size-4 text-cyan-700" aria-hidden="true" />
                Up to 150 nodes
              </span>
              <span className="inline-flex items-center gap-2">
                <GitFork className="size-4 text-indigo-700" aria-hidden="true" />
                Bounded at 1–2 hops
              </span>
            </div>
          </div>
        </div>
      </section>

      <GraphExplorer />
    </main>
  );
}
