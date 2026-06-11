import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from 0 up to `target` once the component mounts.
 * Used for the playful stat counters around the site.
 *
 * @param target   final value to count to
 * @param duration animation length in ms
 * @param start    whether the animation should run (e.g. after loading)
 */
export function useCountUp(target: number, duration = 1100, start = true): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number>();

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutCubic for a snappy, natural finish
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration, start]);

  return value;
}
