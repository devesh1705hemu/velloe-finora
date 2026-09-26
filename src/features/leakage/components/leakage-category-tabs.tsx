"use client";

export interface LeakageCategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function LeakageCategoryTabs({
  activeTab,
  onTabChange,
}: LeakageCategoryTabsProps) {
  const tabs = [
    { id: "all", label: "All Opportunities" },
    { id: "spending_anomaly", label: "Spending Anomalies" },
    { id: "subscription_pattern", label: "Subscription Patterns" },
    { id: "budget_drift", label: "Budget Drift" },
    { id: "recurring_spend", label: "Recurring Spend" },
    { id: "potential_savings", label: "Potential Savings" },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1 border-b border-border/60">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-xl px-3.5 py-1.5 font-medium transition-colors shrink-0 ${
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
