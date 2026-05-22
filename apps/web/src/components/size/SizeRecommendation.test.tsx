import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SizeRecommendation } from "./SizeRecommendation";
import type { SizeRecommendation as SizeRecommendationType } from "@/lib/ai.types";

describe("SizeRecommendation", () => {
  const mockRecommendation: SizeRecommendationType = {
    size: "M",
    confidence: 0.87,
    reasoning: "Based on your measurements and the brand's sizing chart, Medium is the best fit for a tailored silhouette.",
    alternative: "L for a relaxed fit",
  };

  it("renders the empty state CTA when no recommendation is provided", () => {
    render(<SizeRecommendation recommendation={null} />);
    expect(screen.getByText("Get Size Recommendation")).toBeInTheDocument();
    expect(
      screen.getByText("Answer a few questions for a personalized fit")
    ).toBeInTheDocument();
  });

  it("calls onGetAdvice when the empty state CTA is clicked", () => {
    const onGetAdvice = vi.fn();
    render(<SizeRecommendation recommendation={null} onGetAdvice={onGetAdvice} />);
    fireEvent.click(screen.getByText("Get Size Recommendation"));
    expect(onGetAdvice).toHaveBeenCalledTimes(1);
  });

  it("renders the recommendation card with correct data", () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    expect(screen.getByText("Recommended Size")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText(mockRecommendation.reasoning)).toBeInTheDocument();
  });

  it("renders the confidence bar with correct width", () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    const confidenceLabel = screen.getByText("Confidence");
    expect(confidenceLabel).toBeInTheDocument();
    expect(screen.getByText("87%")).toBeInTheDocument();
    const bar = document.querySelector("[style*='width: 87%']");
    expect(bar).toBeInTheDocument();
  });

  it("renders the alternative size text when provided", () => {
    render(<SizeRecommendation recommendation={mockRecommendation} />);
    expect(screen.getByText("Alternative: L for a relaxed fit")).toBeInTheDocument();
  });

  it("does not render alternative text when not provided", () => {
    const recommendationWithoutAlt = { ...mockRecommendation, alternative: undefined };
    render(<SizeRecommendation recommendation={recommendationWithoutAlt} />);
    expect(screen.queryByText("Alternative:")).not.toBeInTheDocument();
  });
});
