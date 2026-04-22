import type { PointerPos } from '../hooks/usePointerPos';

interface Props {
  pos: PointerPos;
}

/**
 * Subtle lime-green radial glow that follows the mouse/touch pointer.
 * Rendered as a fixed div so it works across any layout.
 */
export function CursorGlow({ pos }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1,
        left: pos.x - 320,
        top:  pos.y - 320,
        width:  640,
        height: 640,
        background: 'radial-gradient(circle, rgba(207,241,120,0.06) 0%, transparent 65%)',
        borderRadius: '50%',
        transition: 'left 0.06s linear, top 0.06s linear',
      }}
    />
  );
}
