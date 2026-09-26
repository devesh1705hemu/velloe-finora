"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

const errorLogger = logger.for("ErrorBoundary");

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    errorLogger.error("Uncaught error inside component tree:", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  public handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[360px] w-full flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertOctagon className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            An unexpected error occurred in this financial module. Our automated monitors have captured the incident.
          </p>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="mt-4 max-w-lg overflow-auto rounded-lg bg-slate-900 p-3 text-left font-mono text-xs text-rose-300">
              {this.state.error.message}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button
              variant="default"
              leftIcon={<RotateCcw className="h-4 w-4" />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
