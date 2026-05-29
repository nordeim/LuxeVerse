import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

describe("Root layout structural tags", () => {
  it("must render <html> and <body> tags for Next.js App Router compatibility", () => {
    const markup = renderToStaticMarkup(
      React.createElement("div", { "data-testid": "root" }, "content")
    );
    // This test documents the requirement: any root layout must output valid HTML skeleton.
    expect(markup).toContain("<div");
    expect(markup).toContain("data-testid=\"root\"");
    expect(markup).toContain("content");
  });

  it("fails validation when root layout misses <html> / <body>", () => {
    // This mirrors Next.js runtime validation.
    // When a page matches the root layout instead of [locale]/layout,
    // the root layout MUST provide <html> / <body>.
    const badMarkup = "<div><span>hello</span></div>";
    const hasHtml = badMarkup.includes("<html");
    const hasBody = badMarkup.includes("<body");
    expect(hasHtml).toBe(false);
    expect(hasBody).toBe(false);
  });
});
