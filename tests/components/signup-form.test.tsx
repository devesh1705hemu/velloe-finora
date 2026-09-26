import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "@/app/signup/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("SignupPage Component", () => {
  it("renders all required registration fields and password meter", () => {
    renderWithClient(<SignupPage />);
    expect(screen.getByText("Create your Velloe-Finora Account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Alex Vance")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("alex@company.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("validates empty submission", async () => {
    renderWithClient(<SignupPage />);
    const submitBtn = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide a valid work email/i)).toBeInTheDocument();
    });
  });
});
