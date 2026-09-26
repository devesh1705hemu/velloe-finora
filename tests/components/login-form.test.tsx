import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("LoginPage Component", () => {
  it("renders login form with institutional authentication headers", () => {
    renderWithClient(<LoginPage />);
    expect(screen.getByText("Sign In to Velloe-Finora")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("validates empty submission", async () => {
    renderWithClient(<LoginPage />);
    const submitBtn = screen.getByRole("button", { name: /^sign in$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Please provide a valid email address/i)).toBeInTheDocument();
    });
  });

  it("toggles password visibility", () => {
    renderWithClient(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
