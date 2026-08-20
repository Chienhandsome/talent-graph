import { Skeleton } from "@/components/ui/skeleton";

export default function SkillGapLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-20 max-w-2xl" />
        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <Skeleton className="h-[560px]" />
          <Skeleton className="h-[460px]" />
        </div>
      </div>
    </main>
  );
}
