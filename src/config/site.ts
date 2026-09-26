export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  highlight?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const siteConfig = {
  name: "Velloe-Finora",
  shortName: "Velloe-Finora",
  description: "Enterprise Financial Intelligence, Autonomous Leakage Detection & Predictive Planning",
  version: "1.0.0",
  navGroups: [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: "LayoutDashboard",
        },
      ],
    },
    {
      title: "Money",
      items: [
        {
          title: "Transactions",
          href: "/transactions",
          icon: "ArrowLeftRight",
        },
        {
          title: "Insights",
          href: "/insights",
          icon: "TrendingUp",
        },
        {
          title: "Leakage",
          href: "/leakage",
          icon: "AlertTriangle",
          badge: "3 Anomalies",
        },
      ],
    },
    {
      title: "Planning",
      items: [
        {
          title: "Goals",
          href: "/goals",
          icon: "Target",
        },
        {
          title: "Future",
          href: "/future",
          icon: "Compass",
        },
      ],
    },
    {
      title: "Intelligence",
      items: [
        {
          title: "Finora AI",
          href: "/ai",
          icon: "Sparkles",
          highlight: true,
        },
      ],
    },
    {
      items: [
        {
          title: "Reports",
          href: "/reports",
          icon: "FileSpreadsheet",
        },
        {
          title: "Settings",
          href: "/settings",
          icon: "Settings",
        },
      ],
    },
  ] as NavSection[],
  // Flat list for quick lookups & breadcrumbs
  mainNav: [
    { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { title: "Transactions", href: "/transactions", icon: "ArrowLeftRight" },
    { title: "Insights", href: "/insights", icon: "TrendingUp" },
    { title: "Leakage", href: "/leakage", icon: "AlertTriangle", badge: "3 Anomalies" },
    { title: "Goals", href: "/goals", icon: "Target" },
    { title: "Future", href: "/future", icon: "Compass" },
    { title: "Finora AI", href: "/ai", icon: "Sparkles", highlight: true },
    { title: "Reports", href: "/reports", icon: "FileSpreadsheet" },
    { title: "Settings", href: "/settings", icon: "Settings" },
  ],
  links: {
    docs: "/docs",
    support: "/support",
  },
} as const;

export type SiteConfig = typeof siteConfig;
