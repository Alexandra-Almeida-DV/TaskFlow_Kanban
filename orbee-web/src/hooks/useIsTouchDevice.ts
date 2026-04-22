import { useState, useEffect } from 'react';

/**
 * Returns true when the primary input is a coarse pointer (touch screen).
 * Evaluated once on mount so it never causes re-renders.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);
  return isTouch;
}
