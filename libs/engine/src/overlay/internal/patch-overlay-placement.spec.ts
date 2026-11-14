import { describe, expect, it } from 'vitest';

import { createOverlay } from '../create-overlay';
import type { OverlayPlacement } from '../types/overlay-placement';
import { patchOverlayPlacement } from './patch-overlay-placement';

const BADGE = createOverlay(1, 1, 0x17);

const PANEL: OverlayPlacement = Object.freeze({
  id: 'panel',
  overlay: createOverlay(2, 1, 0x35),
  row: 1,
  column: 2,
});

describe('patchOverlayPlacement', () => {
  it('should return every change applied when the overlay carries the id', () => {
    expect(
      patchOverlayPlacement(PANEL, 'panel', {
        overlay: BADGE,
        row: 7,
        column: 8,
      }),
    ).toEqual({ id: 'panel', overlay: BADGE, row: 7, column: 8 });
  });

  it('should return the fields the changes leave out unchanged when the overlay carries the id', () => {
    expect(patchOverlayPlacement(PANEL, 'panel', { row: 7 })).toEqual({
      ...PANEL,
      row: 7,
    });
  });

  it('should return the very same placement when the id does not match', () => {
    expect(patchOverlayPlacement(PANEL, 'badge', { row: 7 })).toBe(PANEL);
  });
});
