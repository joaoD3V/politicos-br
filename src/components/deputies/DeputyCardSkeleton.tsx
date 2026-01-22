import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DeputyCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Photo skeleton */}
          <Skeleton className="h-32 w-full sm:h-auto sm:w-32 sm:min-h-[160px]" />

          {/* Content skeleton */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="mb-2 flex gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="mb-2 h-6 w-3/4" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <Skeleton className="mt-4 h-9 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
