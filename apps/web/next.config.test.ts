import { it, expect, describe } from "vitest";
import nextConfig from "./next.config";

describe("next.config.ts", () => {
  it("exposes a content security policy header", async () => {
    const config = nextConfig as { headers?: () => Promise<unknown[]> };
    expect(typeof config.headers).toBe("function");
    const result = await config.headers!();
    expect(Array.isArray(result)).toBe(true);
    const cspHeader = (result as Array<{ headers: Array<{ key: string; value: string }> }>)
      .flatMap((item) => item.headers)
      .find((h) => h.key === "Content-Security-Policy");
    expect(cspHeader).toBeDefined();
    expect(cspHeader.value).toContain("default-src 'self'");
    expect(cspHeader.value).toContain("script-src");
  });

  it("enables strict mode", () => {
    expect((nextConfig as { reactStrictMode?: boolean }).reactStrictMode).toBe(true);
  });
});
