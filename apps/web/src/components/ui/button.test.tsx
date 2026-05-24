import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("shows disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole("button", { name: /click me/i }).click();
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("supports variants", () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
