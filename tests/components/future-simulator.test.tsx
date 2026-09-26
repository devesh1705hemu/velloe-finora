import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ScenarioControls } from "@/features/future/components/scenario-controls";
import { ScenarioInputs } from "@/features/future/types";

const mockInputs: ScenarioInputs = {
  discretionarySpendPctDelta: 0,
  cloudInfraSpendPctDelta: 0,
  softwareSaaSSpendPctDelta: 0,
  headcountDelta: 0,
  monthlySavingsContribution: 10000,
  monthlyGoalContribution: 25000,
};

describe("ScenarioControls Component", () => {
  it("renders scenario control sliders and action buttons", () => {
    render(
      <ScenarioControls
        inputs={mockInputs}
        onChange={vi.fn()}
        onReset={vi.fn()}
        onSaveScenario={vi.fn()}
        isModifiedFromBaseline={false}
      />
    );

    expect(screen.getByText("Interactive Scenario Inputs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /save scenario/i })).toBeInTheDocument();
  });

  it("enables reset button when isModifiedFromBaseline is true", () => {
    const handleReset = vi.fn();
    render(
      <ScenarioControls
        inputs={{ ...mockInputs, discretionarySpendPctDelta: -15 }}
        onChange={vi.fn()}
        onReset={handleReset}
        onSaveScenario={vi.fn()}
        isModifiedFromBaseline={true}
      />
    );

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    expect(resetBtn).not.toBeDisabled();
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it("calls onSaveScenario when Save Scenario is clicked", () => {
    const handleSave = vi.fn();
    render(
      <ScenarioControls
        inputs={mockInputs}
        onChange={vi.fn()}
        onReset={vi.fn()}
        onSaveScenario={handleSave}
        isModifiedFromBaseline={true}
      />
    );

    const saveBtn = screen.getByRole("button", { name: /save scenario/i });
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
