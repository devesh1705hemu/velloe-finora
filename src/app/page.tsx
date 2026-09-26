import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FinancialIntelligenceSection } from "@/components/landing/financial-intelligence";
import { LeakageSection } from "@/components/landing/leakage-section";
import { GoalPlanningSection } from "@/components/landing/goal-planning";
import { FutureSimulationSection } from "@/components/landing/future-simulation";
import { FinoraAISection } from "@/components/landing/ai-section";
import { EnterpriseSection } from "@/components/landing/enterprise-section";
import { SecuritySection } from "@/components/landing/security-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Live Product Mockup */}
        <Hero />

        {/* Section 1: Financial Intelligence */}
        <FinancialIntelligenceSection />

        {/* Section 2: Money Leakage */}
        <LeakageSection />

        {/* Section 3: Goal Planning */}
        <GoalPlanningSection />

        {/* Section 4: Future Simulation */}
        <FutureSimulationSection />

        {/* Section 5: Finora AI */}
        <FinoraAISection />

        {/* Enterprise Readiness Scope */}
        <EnterpriseSection />

        {/* Security, Privacy & Compliance Controls */}
        <SecuritySection />

        {/* Pricing Tiers */}
        <PricingSection />
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
}
