import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GlobalError from "./global-error";

describe("GlobalError", () => {
  it("renders error message", () => {
    render(<GlobalError error={new Error("Test error")} reset={() => {}} />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
