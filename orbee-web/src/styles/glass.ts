import { CSSProperties } from 'react';

export const glassStyle: CSSProperties = {
  background:           'rgba(255, 255, 255, 0.03)', 
  backdropFilter:       'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)',
  border:               '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow:            '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
};
