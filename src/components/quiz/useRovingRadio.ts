"use client";

import { useCallback, useRef, type KeyboardEvent } from "react";

/**
 * Roving focus for a custom radiogroup (WAI-ARIA radio pattern, minus
 * "arrow also checks": in a quiz that auto-advances, moving focus must not
 * answer the question). Arrows / Home / End move focus; Space / Enter on the
 * focused radio is its own click, which selects.
 *
 * Only the checked radio (or the first one when nothing is checked) is in the
 * tab order, so Tab enters and leaves the group in one step.
 */
export function useRovingRadio(count: number, checkedIndex: number) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const setRef = useCallback(
    (i: number) => (el: HTMLButtonElement | null) => {
      refs.current[i] = el;
    },
    [],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const current = refs.current.findIndex((el) => el === document.activeElement);
      if (current < 0) return;
      let next = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % count;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + count) % count;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = count - 1;
      if (next < 0) return;
      // Arrows inside the group belong to the group, not to the quiz's "ArrowLeft = back".
      e.preventDefault();
      e.stopPropagation();
      refs.current[next]?.focus();
    },
    [count],
  );

  const tabIndexFor = (i: number) => (i === (checkedIndex >= 0 ? checkedIndex : 0) ? 0 : -1);

  return { setRef, onKeyDown, tabIndexFor };
}
