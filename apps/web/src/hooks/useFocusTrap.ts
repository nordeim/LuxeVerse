import { useEffect, type RefObject } from "react";

export function useFocusTrap(
  isActive: boolean,
  containerRef: RefObject<HTMLElement | null>,
  triggerRef?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const savedTrigger =
      triggerRef?.current ?? (document.activeElement as HTMLElement);
    const container = containerRef.current;

    const getFocusable = (): HTMLElement[] => {
      const candidates = container.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(candidates).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== "Tab" || !container) return;
      const focusable = getFocusable();
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (activeEl === first || !focusable.includes(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last || !focusable.includes(activeEl)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const first = getFocusable()[0];
    if (first) first.focus();
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      savedTrigger?.focus();
    };
  }, [isActive, containerRef, triggerRef]);
}
