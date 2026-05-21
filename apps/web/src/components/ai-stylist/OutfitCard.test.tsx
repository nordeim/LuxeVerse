import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OutfitCard } from "./OutfitCard";
import type { OutfitResponse } from "../../lib/ai.types";

const mockOutfit: OutfitResponse = {
  items: [
    { productId: "p1", name: "Silk Trench", role: "hero", reason: "Hero piece" },
    { productId: "p2", name: "Cashmere Scarf", role: "supporting", reason: "Adds warmth" },
    { productId: "p3", name: "Leather Belt", role: "accessory", reason: "Completes look" },
  ],
  totalPrice: 1250,
  confidence: 0.85,
  name: "Autumn Look",
  mood: "Chic",
};

describe("OutfitCard", () => {
  it("renders empty state when outfit is null", () => {
    render(<OutfitCard outfit={null} />);
    expect(screen.getByText(/Ask the AI Stylist/)).toBeInTheDocument();
  });

  it("renders outfit details", () => {
    const { container } = render(<OutfitCard outfit={mockOutfit} />);
    expect(container).toHaveTextContent("Autumn Look");
    expect(container).toHaveTextContent("Chic");
    expect(container).toHaveTextContent("$1250");
    expect(container).toHaveTextContent("Confidence:");
    expect(container).toHaveTextContent("85%");
  });

  it("renders all outfit items", () => {
    render(<OutfitCard outfit={mockOutfit} />);
    expect(screen.getAllByText("Silk Trench").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cashmere Scarf").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Leather Belt").length).toBeGreaterThan(0);
  });

  it("calls onItemClick when an item is clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(<OutfitCard outfit={mockOutfit} onItemClick={handleClick} />);

    // Find the button containing "Silk Trench"
    const item = Array.from(container.querySelectorAll("button")).find(
      (btn) => btn.textContent?.includes("Silk Trench")
    );
    expect(item).toBeDefined();
    fireEvent.click(item!);

    expect(handleClick).toHaveBeenCalledWith("p1");
  });

  it("renders confidence bar", () => {
    const { container } = render(<OutfitCard outfit={mockOutfit} />);
    expect(container).toHaveTextContent("Confidence:");
    expect(container).toHaveTextContent("85%");
  });
});
