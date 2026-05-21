import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StyleQuizPage from "./page";
import { useStyleQuizStore } from "../../stores/style-quiz";

describe("StyleQuizPage", () => {
  beforeEach(() => {
    useStyleQuizStore.setState({
      answers: [],
      currentStep: 0,
      totalSteps: 5,
      isComplete: false,
    });
  });

  it("renders the first quiz step", () => {
    render(<StyleQuizPage />);
    expect(screen.getByText(/Step 1 of 5/)).toBeInTheDocument();
    expect(screen.getByText(/Which style persona resonates/)).toBeInTheDocument();
  });

  it("renders all answer options", () => {
    render(<StyleQuizPage />);
    // Use queryAllByText to handle multiple potential matches
    expect(screen.queryAllByText(/Romantic/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Minimalist/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Bold/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Classic/).length).toBeGreaterThan(0);
  });

  it("has disabled back button on first step", () => {
    render(<StyleQuizPage />);
    const buttons = screen.getAllByRole("button");
    // Find the button that contains "Back" text
    const backButton = buttons.find((btn) =>
      (btn as HTMLElement).textContent?.includes("Back")
    );
    expect(backButton).toBeDefined();
    expect(backButton).toBeDisabled();
  });
});
