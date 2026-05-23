import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCart } from "./useCart";

describe("useCart", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.addItem).toBe("function");
    expect(typeof result.current.removeItem).toBe("function");
    expect(typeof result.current.updateItem).toBe("function");
  });
});
