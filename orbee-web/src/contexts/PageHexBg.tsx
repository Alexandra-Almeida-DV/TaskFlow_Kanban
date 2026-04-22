import { useState, useEffect, useMemo, useRef } from 'react';
import { useIsTouchDevice } from '../hooks/useIsTouchDevice';
import type { PointerPos } from '../hooks/usePointerPos';

const HEX = 30; 

interface Props {
  pointerPos: PointerPos | null;
}

export function PageHexBg({ pointerPos }: Props) {
  const isTouch = useIsTouchDevice();
  const [scanPos, setScanPos] = useState<PointerPos | null>(null);
  const rafRef   = useRef<number>(0);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    if (!isTouch) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const tick = () => {
      angleRef.current += 0.010;
      const t = angleRef.current;
      setScanPos({
        x: W * 0.5 + Math.cos(t)        * W * 0.44,
        y: H * 0.5 + Math.sin(t * 0.63) * H * 0.40,
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isTouch]);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { w, h } = size;
  const cols = Math.ceil(w / (HEX * 1.75)) + 2;
  const rows = Math.ceil(h / (HEX * 1.52)) + 2;

  const hexagons = useMemo(() => {
    const list: { key: number; cx: number; cy: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push({
          key: r * cols + c,
          cx: c * HEX * 1.75 + (r % 2 === 1 ? HEX * 0.875 : 0),
          cy: r * HEX * 1.52,
        });
      }
    }
    return list;
  }, [cols, rows]);
  const activePos = pointerPos ?? (isTouch ? scanPos : null);
  const brightnesses = useMemo(() => {
    if (!activePos) return hexagons.map(() => 0);
    return hexagons.map(({ cx, cy }) => {
      const dist = Math.sqrt((activePos.x - cx) ** 2 + (activePos.y - cy) ** 2);
      return Math.max(0, 1 - dist / (HEX * 9));
    });
  }, [activePos, hexagons]);

  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="phg-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {hexagons.map(({ cx, cy, key }, i) => {
        const pts = Array.from({ length: 6 }, (_, k) => {
          const a = (Math.PI / 180) * (60 * k - 30);
          return `${cx + HEX * Math.cos(a)},${cy + HEX * Math.sin(a)}`;
        }).join(' ');
        const b = brightnesses[i];
        const ri = Math.round(255 - (255 - 207) * b);
        const gi = Math.round(255 - (255 - 241) * b);
        const bi = Math.round(255 - (255 - 120) * b);
        const strokeA = 0.07 + b * 0.55;
        const fillA   = b * 0.14;

        return (
          <polygon
            key={key}
            points={pts}
            fill={`rgba(${ri},${gi},${bi},${fillA})`}
            stroke={`rgba(${ri},${gi},${bi},${strokeA})`}
            strokeWidth="1"
            filter={b > 0.6 ? 'url(#phg-glow)' : undefined}
            style={{ transition: pointerPos ? 'fill 0.12s ease, stroke 0.12s ease' : 'none' }}
          />
        );
      })}
    </svg>
  );
}
