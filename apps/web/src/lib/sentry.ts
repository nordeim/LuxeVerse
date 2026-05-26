// Sentry-like error tracking stub
// When Sentry is installed, this file should be replaced with actual Sentry config
export function captureException(error: Error, _context?: { extra: Record<string, unknown> }): void {
  console.error("[Telemetry] Captured exception:", error);
}
