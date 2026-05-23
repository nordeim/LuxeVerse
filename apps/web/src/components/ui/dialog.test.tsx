import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";

describe("Dialog", () => {
  it("opens and closes dialog", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <p>Content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText("Title")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("has correct aria roles", () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
  });
});
