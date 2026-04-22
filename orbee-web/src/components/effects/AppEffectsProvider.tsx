import { createContext, useContext, type ReactNode } from 'react';
import { usePointerPos, type PointerPos } from '../../hooks/usePointerPos';
import { PageHexBg } from '../../contexts/PageHexBg';
import { CursorGlow } from '../../contexts/CursorGlow';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppEffectsContextValue {
  /** Current pointer/touch position in viewport coords, or null. */
  pointerPos: PointerPos | null;
}

const AppEffectsContext = createContext<AppEffectsContextValue>({ pointerPos: null });

// ─── Provider ─────────────────────────────────────────────────────────────────

interface AppEffectsProviderProps {
  children: ReactNode;
}

/**
 * Wrap your entire app (or router outlet) with this provider.
 *
 * It renders:
 *  - PageHexBg  — fixed full-screen hex grid (z-index 0)
 *  - CursorGlow — soft lime glow that follows the pointer (z-index 1)
 *  - children   — your actual views (z-index ≥ 2, handled by the children themselves)
 *
 * It also exposes the live pointer position via context so any child
 * component can react to it without duplicating event listeners.
 *
 * @example
 * // main.tsx / App.tsx
 * <AppEffectsProvider>
 *   <RouterOutlet />   // or <Routes>...</Routes>
 * </AppEffectsProvider>
 */
export function AppEffectsProvider({ children }: AppEffectsProviderProps) {
  const pointerPos = usePointerPos();

  return (
    <AppEffectsContext.Provider value={{ pointerPos }}>
      {/* ── Layer 0: hex grid background ── */}
      <PageHexBg pointerPos={pointerPos} />

      {/* ── Layer 1: cursor glow ── */}
      {pointerPos && <CursorGlow pos={pointerPos} />}

      {/* ── Layer 2+: app content ── */}
      {children}
    </AppEffectsContext.Provider>
  );
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

/**
 * Returns the shared pointer position from the nearest AppEffectsProvider.
 *
 * @example
 * const { pointerPos } = useAppEffects();
 */
export function useAppEffects(): AppEffectsContextValue {
  return useContext(AppEffectsContext);
}
