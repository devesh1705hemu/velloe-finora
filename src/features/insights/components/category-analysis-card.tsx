"use client";

import { PieChart, ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/currency";
import { CategoryBreakdown } from "../types";

export interface CategoryAnalysisCardProps {
  categories: CategoryBreakdown[];
}

export function CategoryAnalysisCard({ categories }: CategoryAnalysisCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Functional Category Allocation
            </CardTitle>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            {categories.length} Tracked Categories
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3.5 pt-0 text-xs">
        {categories.map((cat) => {
          const isDown = cat.changePercentage < 0;
          const isUp = cat.changePercentage > 0;

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-semibold text-foreground">{cat.name}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-foreground font-bold">
                    {formatCurrency(cat.amount)}
                  </span>
                  <span className="text-muted-foreground text-[11px] w-12 text-right">
                    {cat.percentageOfTotal.toFixed(1)}%
                  </span>

                  <span
                    className={`inline-flex items-center text-[10px] w-14 justify-end ${
                      isDown
                        ? "text-growth"
                        : isUp
                        ? "text-risk"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isDown ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : isUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    {Math.abs(cat.changePercentage)}%
                  </span>
                </div>
              </div>

              {/* Allocation Progress Meter */}
              <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${cat.percentageOfTotal}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
