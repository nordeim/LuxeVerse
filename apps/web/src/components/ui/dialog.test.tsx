import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dialog, DialogContent } from "./dialog";

describe("Dialog", () => {
  it("renders when open", () => {
    render(
      <Dialog open>
        <DialogContent>Dialog content</DialogContent>
      </Dialog>
    );
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });
});
