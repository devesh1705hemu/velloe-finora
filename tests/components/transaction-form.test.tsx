import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransactionFormModal } from "@/features/transactions/components/transaction-form-modal";

describe("TransactionFormModal Component", () => {
  it("does not render when isOpen is false", () => {
    const { container } = render(
      <TransactionFormModal
        isOpen={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly when open with initial fields", () => {
    render(
      <TransactionFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Record New Transaction")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/e\.g\. Stripe Platform Inflow, AWS Cloud/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /commit record/i })).toBeInTheDocument();
  });

  it("validates merchant name and required fields on empty submit", async () => {
    const handleSubmit = vi.fn();
    render(
      <TransactionFormModal
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /commit record/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Merchant or entity name must be at least 2 characters/i)
      ).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <TransactionFormModal
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
