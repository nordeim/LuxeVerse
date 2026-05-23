import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "./global-error";

const originalEnv = process.env.NODE_ENV;

describe("GlobalError", () => {
  afterEach(() => {
    vi.stubGlobal("process", { env: { NODE_ENV: originalEnv } });
  });

  it("renders error message and retry button", () => {
    const mockError = new Error("Test error");
    (mockError as Error & { digest?: string }).digest = "error-123";

    const mockReset = vi.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("We encountered an unexpected error. Your session may have expired or the service is temporarily unavailable.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByText(/return home/i)).toBeInTheDocument();
    expect(screen.getByText("error-123")).toBeInTheDocument();
  });

  it("calls reset when 'Try again' is clicked", () => {
    const mockError = new Error("Test error");
    const mockReset = vi.fn();

    render(<GlobalError error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it("shows stack trace in development mode", () => {
    vi.stubGlobal("process", { env: { NODE_ENV: "development" } });

    const mockError = new Error("Dev error");
    mockError.stack = "Error: Dev error\n    at Test (file.tsx:1)";

    render(<GlobalError error={mockError} reset={vi.fn()} />);

    expect(screen.getByText("Stack trace")).toBeInTheDocument();
    expect(screen.getByText(/Error: Dev error/)).toBeInTheDocument();
  });
});
