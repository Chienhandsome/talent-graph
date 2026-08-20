import {
  AlertTriangle,
  CheckCircle2,
  Layers3,
  ListChecks,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkillGapInitialState() {
  const steps = [
    {
      icon: Target,
      title: "Choose your target",
      description: "Pick the role you want to assess yourself against.",
    },
    {
      icon: ListChecks,
      title: "Mark what you know",
      description: "Select the required skills you can already use confidently.",
    },
    {
      icon: Sparkles,
      title: "Focus your learning",
      description: "Get an importance-ranked list of the best skills to learn next.",
    },
  ];

  return (
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.35)] ring-slate-200">
      <CardHeader className="items-center px-6 pt-10 text-center sm:px-10">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800">
          <Layers3 className="size-5" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Turn a broad goal into a short learning list.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Start with the suggested AI Engineer example, adjust the skills you
          already have, then analyze the remaining gap.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 px-6 pb-8 sm:grid-cols-3 sm:px-10">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-lg bg-white text-slate-800 shadow-sm ring-1 ring-slate-200">
                <step.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs text-slate-400">
                0{index + 1}
              </span>
            </div>
            <h3 className="font-medium text-slate-900">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-5 text-slate-500">
              {step.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SkillGapLoadingState() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="size-16 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Skeleton key={item} className="h-24" />
        ))}
      </div>
      <Card className="border-0 bg-white ring-slate-200">
        <CardContent className="space-y-3 pt-6">
          <Skeleton className="h-6 w-52" />
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-28 w-full" />
          ))}
        </CardContent>
      </Card>
      <span className="sr-only">Analyzing your skill gap</span>
    </div>
  );
}

export function SkillGapErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry(): void;
}) {
  return (
    <Card className="border-0 bg-white ring-red-200">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">
          We couldn’t analyze this role
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          {message}
        </p>
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

export function SkillGapEmptyState() {
  return (
    <Card className="border-0 bg-white ring-amber-200">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">
          No requirements are mapped yet
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Choose another target role. TalentGraph can only analyze skills linked
          to roles in the curated graph.
        </p>
      </CardContent>
    </Card>
  );
}
