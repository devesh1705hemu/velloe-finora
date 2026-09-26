import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatPercentage } from "@/utils/currency";
import { MetricCardData } from "../types";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  data: MetricCardData;
  className?: string;
}

export function MetricCard({ data, className }: MetricCardProps) {
  const isPositive = data.percentageChange > 0;
  const isNeutral = data.percentageChange === 0;

  const displayValue =
    data.formatAs === "currency"
      ? formatCurrency(data.value, { currency: data.currency })
      : data.formatAs === "percent"
      ? formatPercentage(data.value)
      : data.value.toLocaleString();

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-2">
          <span>{data.label}</span>
          <Badge
            variant={
              data.status === "growth" || (isPositive && !data.status)
                ? "growth"
                : data.status === "risk" || (!isPositive && !isNeutral && !data.status)
                ? "risk"
                : "secondary"
            }
            className="flex items-center gap-1 text-[11px] py-0 px-1.5"
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span>{Math.abs(data.percentageChange)}%</span>
          </Badge>
        </div>

        <div className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {displayValue}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card className="p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-7 w-36" />
    </Card>
  );
}
