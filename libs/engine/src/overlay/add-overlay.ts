import type { Screen } from '../screen/types/screen';
import { filterOtherOverlays } from './internal/filter-other-overlays';
import type { Overlay } from './types/overlay';

/**
 * Adds an overlay on top of the other overlays, over everything light
 * touches. `row` and `column` set its top-left pixel. If an overlay with the
 * same id exists, it is removed first. Returns a new screen.
 */
export const addOverlay = (
  screen: Screen,
  id: string,
  overlay: Overlay,
  row: number,
  column: number,
): Screen => ({
  ...screen,
  overlays: [
    ...filterOtherOverlays(screen.overlays, id),
    { id, overlay, row, column },
  ],
});
