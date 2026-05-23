import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("renders input with label", () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("shows error state and message", () => {
    render(<Input error="Email is required" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
  });

  it("shows helper text", () => {
    render(<Input helperText="We will never share your email." />);
    expect(screen.getByText("We will never share your email.")).toBeInTheDocument();
  });

  it("renders with disabled state", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
