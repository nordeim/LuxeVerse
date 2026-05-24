import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders input with placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("has disabled state", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards ref", () => {
    let refValue: HTMLInputElement | null = null;
    render(
      <Input
        ref={(el) => {
          refValue = el;
        }}
      />
    );
    expect(refValue).toBeInstanceOf(HTMLInputElement);
  });
});
