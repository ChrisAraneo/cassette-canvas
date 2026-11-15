import { find } from 'lodash-es';
import type { OverlayPlacement } from './types/overlay-placement';
import type { Screen } from './types/screen';

/** Returns the overlay with the id, or `undefined` if there is none. */
export const findOverlay = (
  screen: Screen,
  id: string,
): OverlayPlacement | undefined =>
  find(screen.overlays, (placement) => placement.id === id);
