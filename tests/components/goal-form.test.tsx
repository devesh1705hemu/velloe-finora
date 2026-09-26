import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GoalFormDialog } from "@/features/goals/components/goal-form-dialog";

describe("GoalFormDialog Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <GoalFormDialog
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders modal header and fields correctly when open", () => {
    render(
      <GoalFormDialog
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Create New Strategic Goal")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. 12-Month Payroll Reserve/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^create goal$/i })).toBeInTheDocument();
  });

  it("validates required title on submit", async () => {
    const handleSubmit = vi.fn();
    render(
      <GoalFormDialog
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /^create goal$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Goal title must be at least 2 characters/i)).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <GoalFormDialog
        isOpen={true}
        onClose={handleClose}
        onSubmit={vi.fn()}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
