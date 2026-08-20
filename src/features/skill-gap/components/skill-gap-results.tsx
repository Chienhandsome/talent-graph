import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  Gauge,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SkillWithLearning } from "@/types/learning";
import type { SkillRequirement } from "@/types/role";
import type { SkillGapResult } from "@/types/skill-gap";

function SkillList({
  skills,
  tone,
  emptyLabel,
}: {
  skills: SkillRequirement[];
  tone: "held" | "essential" | "optional";
  emptyLabel: string;
}) {
  const toneStyles = {
    held: "border-emerald-200 bg-emerald-50 text-emerald-800",
    essential: "border-rose-200 bg-rose-50 text-rose-800",
    optional: "border-slate-200 bg-slate-50 text-slate-600",
  };

  if (skills.length === 0) {
    return <p className="text-sm leading-6 text-slate-400">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <Badge
          key={skill.id}
          variant="outline"
          className={cn("h-auto min-h-7 whitespace-normal", toneStyles[tone])}
        >
          {tone === "held" ? (
            <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
          ) : null}
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}

function RecommendationCard({
  skill,
  rank,
}: {
  skill: SkillWithLearning;
  rank: number;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_35px_-32px_rgba(15,23,42,.7)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-semibold text-white">
            {rank}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-950">{skill.name}</h3>
              <Badge variant={skill.essential ? "destructive" : "secondary"}>
                {skill.essential ? "Essential" : "Optional"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 capitalize">
              {skill.requiredLevel} level · importance {skill.importance}/5
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {skill.description}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 border-indigo-200 bg-indigo-50 text-indigo-700">
          Next priority
        </Badge>
      </div>

      <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Learn
          </p>
          {skill.resources.length > 0 ? (
            <ul className="space-y-2">
              {skill.resources.slice(0, 2).map((resource) => (
                <li key={resource.id}>
                  {resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-start gap-1 text-sm font-medium text-indigo-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                    >
                      {resource.title}
                      <ExternalLink className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-slate-700">
                      {resource.title}
                    </span>
                  )}
                  <p className="text-xs text-slate-500">{resource.provider}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No resource mapped yet.</p>
          )}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <FolderKanban className="size-3.5" aria-hidden="true" />
            Practice
          </p>
          {skill.projects.length > 0 ? (
            <ul className="space-y-2">
              {skill.projects.slice(0, 2).map((project) => (
                <li key={project.id}>
                  <p className="text-sm font-medium text-slate-800">
                    {project.title}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {project.difficulty}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No project mapped yet.</p>
          )}
        </div>
      </div>
    </article>
  );
}

export function SkillGapResults({ result }: { result: SkillGapResult }) {
  const missingCount =
    result.missingEssentialSkills.length + result.missingOptionalSkills.length;

  return (
    <div className="space-y-5">
      <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.45)] ring-slate-200">
        <CardHeader className="border-b border-slate-100 pb-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
                <Gauge className="size-4" aria-hidden="true" />
                Readiness snapshot
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Your gap for {result.targetRole.name}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                The score weights every matched skill by its importance to the
                target role. It is a learning guide, not a hiring assessment.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <div
                className="relative flex size-16 items-center justify-center rounded-full"
                role="progressbar"
                aria-label="Skill readiness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={result.readinessScore}
                style={{
                  background: `conic-gradient(#4f46e5 ${result.readinessScore}%, #e2e8f0 0)`,
                }}
              >
                <span className="absolute inset-[5px] rounded-full bg-white" />
                <span className="relative text-sm font-semibold">
                  {result.readinessScore}%
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Readiness
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Importance weighted
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-2xl font-semibold text-emerald-900">
                {result.heldSkills.length}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-emerald-800 uppercase">
                Skills covered
              </p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-2xl font-semibold text-rose-900">
                {result.missingEssentialSkills.length}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-rose-800 uppercase">
                Essential gaps
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-2xl font-semibold text-slate-900">
                {result.missingOptionalSkills.length}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-600 uppercase">
                Optional gaps
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 border-t border-slate-100 pt-5 md:grid-cols-3">
            <section>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                Already covered
              </h3>
              <SkillList
                skills={result.heldSkills}
                tone="held"
                emptyLabel="No target-role skills selected yet."
              />
            </section>
            <section>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-rose-700 uppercase">
                Essential gaps
              </h3>
              <SkillList
                skills={result.missingEssentialSkills}
                tone="essential"
                emptyLabel="All essential skills are covered."
              />
            </section>
            <section>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Optional gaps
              </h3>
              <SkillList
                skills={result.missingOptionalSkills}
                tone="optional"
                emptyLabel="All optional skills are covered."
              />
            </section>
          </div>
        </CardContent>
      </Card>

      {missingCount === 0 ? (
        <Card className="border-0 bg-emerald-50 ring-emerald-200">
          <CardContent className="flex items-start gap-3 p-5 text-emerald-900">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Every mapped skill is covered</h2>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Consider validating your depth through a portfolio project or
                exploring a more advanced target role.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <section aria-labelledby="next-skills-heading">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
                <Sparkles className="size-4" aria-hidden="true" />
                Focused learning plan
              </p>
              <h2
                id="next-skills-heading"
                className="mt-2 text-xl font-semibold tracking-tight text-slate-950"
              >
                Learn these skills next
              </h2>
            </div>
            <p className="inline-flex items-center gap-2 text-sm text-slate-500">
              <Lightbulb className="size-4" aria-hidden="true" />
              Ordered by importance
            </p>
          </div>

          <div className="space-y-3">
            {result.recommendedNextSkills.map((skill, index) => (
              <RecommendationCard key={skill.id} skill={skill} rank={index + 1} />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-500">
        <Target className="size-4 shrink-0 text-indigo-600" aria-hidden="true" />
        <span>{result.totalRequiredSkills} mapped skills were compared.</span>
        <ArrowRight className="ml-auto size-4 shrink-0 text-slate-400" aria-hidden="true" />
      </div>
    </div>
  );
}
