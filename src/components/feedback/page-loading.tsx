import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface PageLoadingProps {
  message?: string;
  variant?: "spinner" | "skeleton";
  className?: string;
}

export function PageLoading({
  message = "Loading financial data...",
  variant = "skeleton",
  className,
}: PageLoadingProps) {
  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "flex min-h-[400px] w-full flex-col items-center justify-center p-8",
          className
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 p-6 w-full animate-in fade-in-50", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 rounded-xl border bg-card space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border bg-card space-y-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="p-6 rounded-xl border bg-card space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
