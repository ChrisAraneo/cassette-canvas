import { map } from 'lodash-es';
import type { Screen } from '../screen/types/screen';
import { patchOverlayPlacement } from './internal/patch-overlay-placement';
import type { OverlayChanges } from './types/overlay-changes';

/**
 * Changes an overlay's `overlay`, `row` or `column`. Fields you leave out
 * keep their values. The overlay keeps its place in the drawing order.
 * Returns a new screen. If no overlay has the id, nothing changes.
 */
export const patchOverlay = (
  screen: Screen,
  id: string,
  changes: OverlayChanges,
): Screen => ({
  ...screen,
  overlays: map(screen.overlays, (placement) =>
    patchOverlayPlacement(placement, id, changes),
  ),
});
