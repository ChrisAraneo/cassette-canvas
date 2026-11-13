import type { Screen } from '../screen/types/screen';
import { filterOtherOverlays } from './internal/filter-other-overlays';

/** Removes the overlay with the id. Returns a new screen. */
export const removeOverlay = (screen: Screen, id: string): Screen => ({
  ...screen,
  overlays: filterOtherOverlays(screen.overlays, id),
});
