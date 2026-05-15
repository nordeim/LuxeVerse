import "@testing-library/jest-dom/vitest";
import { vi, beforeEach, afterEach } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.stubGlobal(
    "requestAnimationFrame",
    (cb: FrameRequestCallback) => {
      return window.setTimeout(cb, 16) as unknown as number;
    }
  );
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    window.clearTimeout(id);
  });
  Object.defineProperty(window, "crypto", {
    value: {
      randomUUID: () => "test-uuid-" + Math.random().toString(36).slice(2),
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
