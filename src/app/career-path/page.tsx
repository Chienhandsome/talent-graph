import type { Metadata } from "next";
import { GitFork, Route, Sparkles } from "lucide-react";

import { CareerPathExplorer } from "@/features/career-path/components/career-path-explorer";

export const metadata: Metadata = {
  title: "Career Path Explorer | TalentGraph",
  description:
    "Find realistic role transitions and the skills, resources, and projects that can help you make each move.",
};

export default function CareerPathPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-950">
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
              Graph-powered career planning
            </div>
            <h1 className="max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              See the moves between where you are and where you want to be.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Compare realistic role transitions, understand which skills carry
              forward, and turn every gap into a focused learning plan.
            </p>
            
          </div>
        </div>
      </section>

      <CareerPathExplorer />
    </main>
  );
}
