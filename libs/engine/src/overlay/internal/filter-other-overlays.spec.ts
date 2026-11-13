import { describe, expect, it } from 'vitest';

import { createOverlay } from '../create-overlay';
import type { OverlayPlacement } from '../types/overlay-placement';
import { filterOtherOverlays } from './filter-other-overlays';

const PANEL: OverlayPlacement = Object.freeze({
  id: 'panel',
  overlay: createOverlay(1, 1, 0x35),
  row: 0,
  column: 0,
});

const BADGE: OverlayPlacement = Object.freeze({
  id: 'badge',
  overlay: createOverlay(1, 1, 0x17),
  row: 1,
  column: 1,
});

describe('filterOtherOverlays', () => {
  it('should drop the overlay with the id and keep the rest in order', () => {
    expect(filterOtherOverlays([PANEL, BADGE], 'panel')).toEqual([BADGE]);
  });

  it('should keep every overlay when none has the id', () => {
    expect(filterOtherOverlays([PANEL, BADGE], 'ghost')).toEqual([
      PANEL,
      BADGE,
    ]);
  });
});
