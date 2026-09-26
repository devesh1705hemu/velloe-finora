"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { ProjectionPoint } from "../types";

export interface ProjectionChartProps {
  data: ProjectionPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const baseline = payload.find((p) => p.name === "Actual Baseline")?.value || 0;
    const scenario = payload.find((p) => p.name === "Scenario Projection")?.value || 0;
    const diff = scenario - baseline;

    return (
      <div className="rounded-xl border border-border bg-popover p-3 shadow-xl text-xs space-y-1.5">
        <span className="font-bold text-foreground block font-mono">{label}</span>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Actual Baseline:
            </span>
            <span className="font-mono font-semibold text-foreground">
              {formatCurrency(baseline)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Scenario Projection:
            </span>
            <span className="font-mono font-bold text-primary">
              {formatCurrency(scenario)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/60">
            <span className="text-muted-foreground">Potential Difference:</span>
            <span
              className={`font-mono font-bold ${
                diff >= 0 ? "text-growth" : "text-destructive"
              }`}
            >
              {diff >= 0 ? "+" : ""}
              {formatCurrency(diff)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              12-Month Treasury & Capital Projection
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Comparative forward trajectory: Actual Baseline vs Scenario Sandbox
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-mono">
            Projection Horizon: 12 Mo
          </Badge>
          <Badge variant="secondary" className="text-[10px] gap-1 text-primary">
            <Sparkles className="h-3 w-3" /> Potential Trajectory
          </Badge>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScenario" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              iconType="circle"
            />

            <Area
              type="monotone"
              dataKey="baselineCapital"
              name="Actual Baseline"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorBaseline)"
            />

            <Area
              type="monotone"
              dataKey="scenarioCapital"
              name="Scenario Projection"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorScenario)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
