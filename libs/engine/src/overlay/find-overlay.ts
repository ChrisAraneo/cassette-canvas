import { find } from 'lodash-es';
import type { Screen } from '../screen/types/screen';
import type { OverlayPlacement } from './types/overlay-placement';

/** Returns the overlay with the id, or `undefined` if there is none. */
export const findOverlay = (
  screen: Screen,
  id: string,
): OverlayPlacement | undefined =>
  find(screen.overlays, (placement) => placement.id === id);
