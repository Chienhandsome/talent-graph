import {
  AlertTriangle,
  GitFork,
  MousePointer2,
  Network,
  RefreshCw,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GraphInitialState() {
  const steps = [
    {
      icon: GitFork,
      title: "Choose a role",
      description: "Use a familiar role as the center of your exploration.",
    },
    {
      icon: SlidersHorizontal,
      title: "Set the depth",
      description: "One hop is focused; two hops reveals the wider neighborhood.",
    },
    {
      icon: MousePointer2,
      title: "Inspect connections",
      description: "Click a node or use the keyboard-friendly inspector for details.",
    },
  ];

  return (
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.35)] ring-slate-200">
      <CardHeader className="items-center px-6 pt-10 text-center sm:px-10">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-900">
          <Network className="size-5" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Start with one role and follow the connections.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          The default Frontend Developer example shows roles, required skills,
          related skills, learning resources, and portfolio projects.
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

export function GraphLoadingState() {
  return (
    <Card className="border-0 bg-white ring-slate-200" aria-live="polite" aria-busy="true">
      <CardHeader className="flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[480px] w-full lg:h-[620px]" />
        <span className="sr-only">Loading graph neighborhood</span>
      </CardContent>
    </Card>
  );
}

export function GraphErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry(): void;
}) {
  return (
    <Card className="border-0 bg-white ring-red-200">
      <CardContent className="flex flex-col items-center px-6 py-14 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">We couldn’t load this graph</h2>
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

export function GraphEmptyState() {
  return (
    <Card className="border-0 bg-white ring-amber-200">
      <CardContent className="flex flex-col items-center px-6 py-14 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <SearchX className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">No connected nodes found</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Try another root role or increase the graph depth to two hops.
        </p>
      </CardContent>
    </Card>
  );
}
