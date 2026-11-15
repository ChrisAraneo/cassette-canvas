import { filterOtherOverlays } from './internal/filter-other-overlays';
import type { Screen } from './types/screen';

/** Removes the overlay with the id. Returns a new screen. */
export const removeOverlay = (screen: Screen, id: string): Screen => ({
  ...screen,
  overlays: filterOtherOverlays(screen.overlays, id),
});
