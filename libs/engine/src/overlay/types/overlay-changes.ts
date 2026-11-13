import type { OverlayPlacement } from './overlay-placement';

/** The overlay fields to change. Fields you leave out keep their values. */
export type OverlayChanges = Partial<
  Pick<OverlayPlacement, 'overlay' | 'row' | 'column'>
>;
