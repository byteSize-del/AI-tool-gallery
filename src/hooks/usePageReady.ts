import { useEffect, useState } from "react";
import { SKELETON_MS } from "../config";

/**
 * Simulates a short async content load so we can show skeleton
 * placeholders before the real content appears. The delay is driven by
 * the central DEMO_MODE config (see src/config.ts): in a non-demo build
 * it collapses to 0ms, so this is honest about being a teaching device.
 *
 * @param delay how long (ms) to stay in the "loading" state
 * @param deps  optional dependency list; when it changes the
 *              loading state resets (e.g. navigating between categories)
 */
export function usePageReady(delay = SKELETON_MS, deps: unknown[] = []): boolean {
  const [ready, setReady] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setReady(true);
      return;
    }
    setReady(false);
    const timer = window.setTimeout(() => setReady(true), delay);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ready;
}
