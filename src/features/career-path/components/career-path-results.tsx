import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FolderKanban,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  CareerPathResult,
  MissingSkill,
  TransitionSummary,
} from "@/types/career-path";
import type { SkillRequirement } from "@/types/role";

const difficultyStyles: Record<TransitionSummary["difficulty"], string> = {
  easy: "border-emerald-200 bg-emerald-50 text-emerald-800",
  moderate: "border-amber-200 bg-amber-50 text-amber-800",
  hard: "border-rose-200 bg-rose-50 text-rose-800",
};

function SkillPills({
  skills,
  tone,
}: {
  skills: SkillRequirement[];
  tone: "shared" | "essential" | "optional";
}) {
  const toneStyles = {
    shared: "border-emerald-200 bg-emerald-50 text-emerald-800",
    essential: "border-rose-200 bg-rose-50 text-rose-800",
    optional: "border-slate-200 bg-slate-50 text-slate-600",
  };

  if (skills.length === 0) {
    return <span className="text-xs text-slate-400">None</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <Badge
          key={skill.id}
          variant="outline"
          className={cn("h-auto min-h-6 whitespace-normal", toneStyles[tone])}
        >
          {tone === "shared" ? (
            <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
          ) : null}
          {skill.name}
        </Badge>
      ))}
    </div>
  );
}

function MissingSkillCard({ skill }: { skill: MissingSkill }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-medium text-slate-900">{skill.name}</h4>
          <p className="mt-1 text-xs text-slate-500">
            {skill.requiredLevel} level · importance {skill.importance}/5
          </p>
        </div>
        <Badge variant={skill.essential ? "destructive" : "secondary"}>
          {skill.essential ? "Essential" : "Optional"}
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Learn
          </p>
          {skill.resources.length > 0 ? (
            <ul className="space-y-2">
              {skill.resources.map((resource) => (
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
                    <span className="text-sm text-slate-700">{resource.title}</span>
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
              {skill.projects.map((project) => (
                <li key={project.id}>
                  <p className="text-sm font-medium text-slate-800">{project.title}</p>
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
    </div>
  );
}

function PathCard({ path, index }: { path: CareerPathResult; index: number }) {
  const missingCount = path.steps.reduce(
    (total, step) =>
      total +
      step.missingEssentialSkills.length +
      step.missingOptionalSkills.length,
    0,
  );

  return (
    <Card className="border-0 bg-white shadow-[0_16px_50px_-38px_rgba(15,23,42,.55)] ring-slate-200">
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-slate-950 text-white">Path {index + 1}</Badge>
              <Badge variant="outline">
                {path.hops} {path.hops === 1 ? "transition" : "transitions"}
              </Badge>
              <Badge variant="outline">
                {missingCount} {missingCount === 1 ? "skill" : "skills"} to build
              </Badge>
            </div>
            <CardTitle className="mt-4 text-xl tracking-tight">
              {path.roles[0].name} to {path.roles[path.roles.length - 1].name}
            </CardTitle>
            <CardDescription className="mt-1 leading-6">
              Ranked by path length first, then by transferable skill coverage.
            </CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            <div
              className="relative flex size-14 items-center justify-center rounded-full"
              role="progressbar"
              aria-label="Estimated skill fit"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={path.suitabilityScore}
              style={{
                background: `conic-gradient(#059669 ${path.suitabilityScore}%, #e2e8f0 0)`,
              }}
            >
              <span className="absolute inset-[5px] rounded-full bg-white" />
              <span className="relative text-sm font-semibold">{path.suitabilityScore}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Skill fit
              </p>
              <p className="mt-0.5 text-xs text-slate-500">Across all steps</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-slate-950 p-3 text-white">
          {path.roles.map((role, roleIndex) => (
            <div key={role.id} className="contents">
              <span className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium sm:text-sm">
                {role.name}
              </span>
              {roleIndex < path.roles.length - 1 ? (
                <ArrowRight className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {path.steps.map((step, stepIndex) => {
          const missingSkills = [
            ...step.missingEssentialSkills,
            ...step.missingOptionalSkills,
          ];

          return (
            <section
              key={`${path.id}-${stepIndex}`}
              className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5"
              aria-labelledby={`${path.id}-step-${stepIndex}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs font-semibold text-white">
                    {stepIndex + 1}
                  </span>
                  <div>
                    <h3
                      id={`${path.id}-step-${stepIndex}`}
                      className="flex flex-wrap items-center gap-2 font-semibold text-slate-900"
                    >
                      {step.fromRole.name}
                      <ArrowRight className="size-4 text-slate-400" aria-hidden="true" />
                      {step.toRole.name}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      {step.transition.reason}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    difficultyStyles[step.transition.difficulty],
                  )}
                >
                  {step.transition.difficulty}
                </Badge>
              </div>

              <div className="mt-5 grid gap-4 border-t border-slate-200 pt-4 md:grid-cols-3">
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                    Transfers forward
                  </p>
                  <SkillPills skills={step.sharedSkills} tone="shared" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-rose-700 uppercase">
                    Essential gaps
                  </p>
                  <SkillPills skills={step.missingEssentialSkills} tone="essential" />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Optional gaps
                  </p>
                  <SkillPills skills={step.missingOptionalSkills} tone="optional" />
                </div>
              </div>

              {missingSkills.length > 0 ? (
                <details className="group/details mt-5 rounded-xl border border-slate-200 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="size-4 text-indigo-600" aria-hidden="true" />
                      Learning plan for {missingSkills.length}{" "}
                      {missingSkills.length === 1 ? "skill" : "skills"}
                    </span>
                    <ChevronDown className="size-4 transition-transform group-open/details:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="grid gap-3 border-t border-slate-200 bg-slate-50/50 p-3 lg:grid-cols-2">
                    {missingSkills.map((skill) => (
                      <MissingSkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </details>
              ) : null}
            </section>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function CareerPathResults({ paths }: { paths: CareerPathResult[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            <Route className="size-4" aria-hidden="true" />
            Ranked results
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {paths.length} {paths.length === 1 ? "path" : "paths"} worth exploring
          </h2>
        </div>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500">
          <Target className="size-4" aria-hidden="true" />
          Shortest paths appear first
        </p>
      </div>

      {paths.map((path, index) => (
        <PathCard key={path.id} path={path} index={index} />
      ))}
    </div>
  );
}
