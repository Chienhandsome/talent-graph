import {
  AlertTriangle,
  BookOpenCheck,
  Compass,
  Lightbulb,
  RefreshCw,
  Route,
  SearchX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CareerPathInitialState() {
  const steps = [
    {
      icon: Compass,
      title: "Choose your direction",
      description: "Select the role you have today and the role you want next.",
    },
    {
      icon: Route,
      title: "Compare realistic routes",
      description: "We explore directed transitions and rank the clearest paths.",
    },
    {
      icon: BookOpenCheck,
      title: "Turn gaps into actions",
      description: "Every missing skill comes with resources or a practice project.",
    },
  ];

  return (
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.35)] ring-slate-200">
      <CardHeader className="items-center px-6 pt-10 text-center sm:px-10">
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
          <Lightbulb className="size-5" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl tracking-tight">
          Your next move starts with context.
        </CardTitle>
        <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">
          Start with the suggested Frontend Developer → AI Engineer example, or
          choose your own direction. Nothing is submitted until you select
          “Find career paths.”
        </CardDescription>
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
              <span className="font-mono text-xs text-slate-400">0{index + 1}</span>
            </div>
            <h2 className="font-medium text-slate-900">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-5 text-slate-500">
              {step.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CareerPathLoadingState() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="size-14 rounded-full" />
      </div>
      {[0, 1].map((item) => (
        <Card key={item} className="border-0 bg-white ring-slate-200">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
      <span className="sr-only">Finding career paths</span>
    </div>
  );
}

export function CareerPathErrorState({
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
        <h2 className="mt-5 text-lg font-semibold">We couldn’t build this path</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
        <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
          <RefreshCw aria-hidden="true" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}

export function CareerPathEmptyState() {
  return (
    <Card className="border-0 bg-white ring-amber-200">
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <SearchX className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">No path within this limit</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Try increasing the maximum path length or choose a closer target role.
          TalentGraph only follows transitions included in the curated dataset.
        </p>
      </CardContent>
    </Card>
  );
}
