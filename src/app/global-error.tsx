"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Root Layout Crash:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-white text-center font-sans">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/60 text-rose-400 mb-4 border border-rose-800/40">
          <AlertOctagon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Critical System Error</h1>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          A root-level exception prevented Finora from rendering.
        </p>
        <button
          onClick={() => reset()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Restart Application
        </button>
      </body>
    </html>
  );
}
