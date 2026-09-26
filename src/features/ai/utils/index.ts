export function formatConfidenceScore(score: number): {
  percent: string;
  variant: "growth" | "warning" | "risk";
} {
  const rounded = Math.round(score * 100);
  if (rounded >= 90) return { percent: `${rounded}%`, variant: "growth" };
  if (rounded >= 70) return { percent: `${rounded}%`, variant: "warning" };
  return { percent: `${rounded}%`, variant: "risk" };
}
