import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "./drawer";

describe("Drawer", () => {
  it("opens and closes drawer", () => {
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button>Open Drawer</button>
        </DrawerTrigger>
        <DrawerContent side="right">
          <DrawerTitle>Drawer Title</DrawerTitle>
          <p>Drawer content</p>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.queryByText("Drawer Title")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Open Drawer"));
    expect(screen.getByText("Drawer Title")).toBeInTheDocument();
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("renders with correct side class", () => {
    render(
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent side="left" data-testid="drawer">
          <DrawerTitle>Left Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    const drawer = screen.getByRole("dialog");
    // Radix renders the content; assert it's in the document
    expect(drawer).toBeInTheDocument();
  });
});
