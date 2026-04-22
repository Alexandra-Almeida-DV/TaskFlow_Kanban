import { useState, useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { glassStyle } from '../styles/glass';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  radius?: string;
  revealDelay?: number;
  noHover?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function GlassCard({
  children,
  className = '',
  radius = '32px',
  revealDelay = 0,
  noHover = false,
  style,
  onClick,
}: GlassCardProps) {
  const [hovered,  setHovered]  = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => setRevealed(true), revealDelay + 20);
    return () => clearTimeout(timerRef.current);
  }, [revealDelay]);

  const isActive = !noHover && hovered;

  const combinedStyle: CSSProperties = {
    ...glassStyle,

    ...(isActive && {
      border:     '1px solid rgba(207,241,120,0.45)',
      boxShadow:  '0 20px 60px rgba(139,95,255,0.22), inset 0 1px 0 rgba(255,255,255,0.14)',
    }),
    borderRadius: radius,
    position: 'relative',
    overflow: 'hidden',
    opacity:   revealed ? 1 : 0,
    transform: revealed
      ? isActive ? 'translateY(-3px)' : 'translateY(0)'
      : 'translateY(16px)',

    transition: [
      'opacity 0.45s ease',
      'transform 0.45s ease',
      'border 0.3s ease',
      'box-shadow 0.3s ease',
    ].join(', '),

    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div
      className={className}
      style={combinedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      onTouchCancel={() => setHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function GlassCardAccent(props: GlassCardProps) {
  return (
    <GlassCard
      {...props}
      style={{
        border: '1px solid rgba(207,241,120,0.25)',
        ...props.style,
      }}
    />
  );
}

export function GlassPanel({
  children,
  className = '',
  radius = '32px',
  revealDelay = 0,
  style,
}: Omit<GlassCardProps, 'noHover' | 'onClick'>) {
  return (
    <GlassCard
      className={className}
      radius={radius}
      revealDelay={revealDelay}
      noHover
      style={style}
    >
      {children}
    </GlassCard>
  );
}
