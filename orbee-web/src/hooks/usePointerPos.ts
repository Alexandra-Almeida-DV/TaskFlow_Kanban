import { useState, useEffect } from 'react';

export interface PointerPos {
  x: number;
  y: number;
}

/**
 * Tracks the global mouse/touch position in viewport coordinates.
 * Returns null when the pointer leaves the window or no touch is active.
 */
export function usePointerPos(): PointerPos | null {
  const [pos, setPos] = useState<PointerPos | null>(null);

  useEffect(() => {
    const onMove  = (e: MouseEvent)  => setPos({ x: e.clientX, y: e.clientY });
    const onLeave = ()               => setPos(null);
    const onTouch = (e: TouchEvent)  => {
      const t = e.touches[0];
      if (t) setPos({ x: t.clientX, y: t.clientY });
    };
    const onTouchEnd = () => setPos(null);

    window.addEventListener('mousemove',   onMove);
    window.addEventListener('mouseleave',  onLeave);
    window.addEventListener('touchmove',   onTouch,    { passive: true });
    window.addEventListener('touchend',    onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove',   onMove);
      window.removeEventListener('mouseleave',  onLeave);
      window.removeEventListener('touchmove',   onTouch);
      window.removeEventListener('touchend',    onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return pos;
}
