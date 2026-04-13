import { Skeleton } from "@/components/ui/skeleton";

export function PlanCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-8 border border-border">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-5 w-20 rounded-full shimmer" />
          <Skeleton className="h-6 w-36 rounded-lg shimmer" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl shimmer" />
      </div>
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-28 rounded-lg shimmer" />
        <Skeleton className="h-4 w-20 rounded shimmer" />
      </div>
      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full rounded shimmer" />
        <Skeleton className="h-4 w-4/5 rounded shimmer" />
        <Skeleton className="h-4 w-3/5 rounded shimmer" />
      </div>
      <Skeleton className="h-12 w-full rounded-full shimmer" />
    </div>
  );
}
