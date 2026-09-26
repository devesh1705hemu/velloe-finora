"use client";

import { useEffect, useState } from "react";

/**
 * Hook to check if component is mounted on the client to avoid hydration mismatch.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
