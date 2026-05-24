import { describe, it, expect } from "vitest";
import { isRTL, rtlLocales } from "./config";

describe("i18n Config", () => {
  describe("isRTL", () => {
    it("should return true for Arabic (ar)", () => {
      expect(isRTL("ar")).toBe(true);
    });

    it("should return false for English (en)", () => {
      expect(isRTL("en")).toBe(false);
    });

    it("should return false for French (fr)", () => {
      expect(isRTL("fr")).toBe(false);
    });

    it("should return false for unknown locale", () => {
      expect(isRTL("de")).toBe(false);
    });
  });

  describe("rtlLocales", () => {
    it("should contain 'ar'", () => {
      expect(rtlLocales).toContain("ar");
    });
  });
});
