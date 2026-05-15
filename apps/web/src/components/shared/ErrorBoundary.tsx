"use client";

import React, { type ReactNode } from "react";

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("[ErrorBoundary] Caught:", error, info);
    this.props.onError?.(error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-screen items-center justify-center bg-obsidian-50 p-8 text-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-display text-obsidian-900">Something went wrong.</h2>
              <p className="mt-2 text-sm text-obsidian-600">
                We encountered an unexpected error. Please try refreshing the page.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="mt-6 rounded-lg bg-metallic-champagne px-4 py-2 text-obsidian-950 font-medium hover:bg-metallic-gold transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
