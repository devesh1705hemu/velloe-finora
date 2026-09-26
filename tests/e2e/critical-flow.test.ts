import { describe, it, expect, beforeEach } from "vitest";
import { authService } from "@/features/auth/services";
import { tokenStorage } from "@/services/token-storage";
import { transactionService } from "@/features/transactions/services";
import { leakageService } from "@/features/leakage/services";
import { goalsService } from "@/features/goals/services";
import { futureService } from "@/features/future/services";
import { aiService } from "@/features/ai/services";

/**
 * End-to-End Critical Flow Test:
 * Landing
 *  ↓
 * Login / Guest
 *  ↓
 * Dashboard
 *  ↓
 * Transactions
 *  ↓
 * Leakage
 *  ↓
 * Goals
 *  ↓
 * Future Simulator
 *  ↓
 * AI
 *  ↓
 * Logout
 */
describe("E2E Critical User Flow", () => {
  beforeEach(() => {
    tokenStorage.clearToken();
  });

  it("executes the entire critical user journey with zero leaks and complete architectural integrity", async () => {
    // 1. Landing: Verify initial unauthenticated state
    expect(tokenStorage.getToken()).toBeNull();

    // 2. Login / Guest: Authenticate via Guest Demo Mode
    const loginResponse = await authService.loginGuestDemo();
    expect(loginResponse.success).toBe(true);
    expect(loginResponse.data.session).toBeDefined();
    expect(loginResponse.data.session?.user.email).toBe("guest@finora.demo");
    expect(tokenStorage.getToken()).toBeTruthy();
    expect(tokenStorage.isDemo()).toBe(true);

    // 3. Dashboard: Current user session loaded with permissions
    const currentUserRes = await authService.getCurrentUser();
    expect(currentUserRes.success).toBe(true);
    expect(currentUserRes.data.fullName).toBe("Demo Allocator");
    expect(currentUserRes.data.role).toBe("viewer");

    // 4. Transactions: Query paginated ledger transactions
    const paginatedTx = await transactionService.getTransactions({ page: 1, limit: 10 });
    expect(paginatedTx.items.length).toBeGreaterThan(0);
    const firstTx = paginatedTx.items[0];
    expect(firstTx).toBeDefined();
    expect(firstTx?.amount).toBeGreaterThan(0);
    expect(firstTx?.merchantName).toBeTruthy();
    expect(firstTx?.category).toBeDefined();


    // 5. Leakage: Review potential leakage and anomalies
    const leakageReport = await leakageService.getLeakageReport();
    expect(leakageReport.opportunities.length).toBeGreaterThan(0);
    expect(leakageReport.totalIdentifiedOptimization).toBeGreaterThan(0);
    expect(leakageReport.annualizedSavingsPotential).toBe(
      leakageReport.totalIdentifiedOptimization * 12
    );
    const firstOpp = leakageReport.opportunities[0];
    expect(firstOpp).toBeDefined();
    expect(firstOpp?.supportingTransactions.length).toBeGreaterThan(0);
    expect(firstOpp?.explainability).toBeDefined();

    // 6. Goals: Query actual progress and projected milestones
    const goalsRes = await goalsService.getGoals();
    expect(goalsRes.success).toBe(true);
    expect(goalsRes.data.length).toBeGreaterThan(0);
    const sampleGoal = goalsRes.data[0];
    expect(sampleGoal).toBeDefined();
    expect(sampleGoal?.targetAmount).toBeGreaterThan(0);
    expect(sampleGoal?.projection.actualProgressPercentage).toBeDefined();
    expect(sampleGoal?.projection.projectedProgressPercentage).toBeDefined();

    // 7. Future Simulator: Load actual baseline and execute isolated projection
    const baselineRes = await futureService.getActualBaseline();
    expect(baselineRes.success).toBe(true);
    expect(baselineRes.data.monthlyRevenue).toBe(52000);

    const savedScenariosRes = await futureService.getSavedScenarios();
    expect(savedScenariosRes.success).toBe(true);
    expect(savedScenariosRes.data.length).toBeGreaterThan(0);

    // 8. AI: Stream financial question through verified backend abstraction
    let streamedCalculatedData = false;
    const aiMessage = await aiService.streamResponse(
      "What are my biggest potential savings opportunities?",
      (chunk) => {
        if (chunk.calculatedData) {
          streamedCalculatedData = true;
        }
      }
    );
    expect(streamedCalculatedData).toBe(true);

    expect(aiMessage.role).toBe("assistant");
    expect(aiMessage.content.length).toBeGreaterThan(20);
    expect(aiMessage.calculatedData).toBeDefined();

    // 9. Logout: Invalidate session and purge client credentials
    await authService.logout();
    expect(tokenStorage.getToken()).toBeNull();
  });
});

