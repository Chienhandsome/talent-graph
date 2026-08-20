import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorerLoading() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-20 max-w-3xl" />
        <div className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">
          <Skeleton className="h-[620px]" />
          <Skeleton className="h-[620px]" />
        </div>
      </div>
    </main>
  );
}
