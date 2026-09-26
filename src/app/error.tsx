"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RetryUI } from "@/components/feedback/retry-ui";
import { logger } from "@/utils/logger";

const routeLogger = logger.for("RouteError");

export default function ErrorBoundaryRoute({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    routeLogger.error("Route level error occurred", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6">
      <RetryUI
        title="Application Route Interrupted"
        message="A route level exception occurred while rendering this view. Our telemetry service has logged the stack trace."
        error={error}
        errorCode={error.digest ? `DIGEST_${error.digest.slice(0, 8).toUpperCase()}` : "ERR_ROUTE_FAILURE"}
        onRetry={() => reset()}
      />

      <div className="mt-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard" className="gap-2 text-xs text-muted-foreground hover:text-foreground">
            <Home className="h-3.5 w-3.5" /> Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
