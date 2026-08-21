import type { Metadata } from "next";
import { Sparkles, Target } from "lucide-react";

import { SkillGapExplorer } from "@/features/skill-gap/components/skill-gap-explorer";

export const metadata: Metadata = {
  title: "Skill Gap Analysis | TalentGraph",
  description:
    "Compare your current skills with a target role and get a focused, ranked learning plan.",
};

export default function SkillGapPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-slate-950">
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
              Focused skill-gap analysis
            </div>
            <h1 className="max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
              Know exactly what stands between you and your next role.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Compare the skills you already use with a target role, then turn
              the most important gaps into a practical learning sequence.
            </p>
          
          </div>
        </div>
      </section>

      <SkillGapExplorer />
    </main>
  );
}
