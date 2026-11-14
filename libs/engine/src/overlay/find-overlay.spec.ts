import { describe, expect, it } from 'vitest';

import type { Screen } from '../screen/types/screen';
import { createOverlay } from './create-overlay';
import { findOverlay } from './find-overlay';

const PANEL = createOverlay(2, 1, 0x35);

const createHudScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [],
  lights: [],
  overlays: [{ id: 'panel', overlay: PANEL, row: 1, column: 2 }],
});

describe('findOverlay', () => {
  it('should return the overlay when the screen holds the id', () => {
    expect(findOverlay(createHudScreen(), 'panel')).toEqual({
      id: 'panel',
      overlay: PANEL,
      row: 1,
      column: 2,
    });
  });

  it('should return undefined when no overlay has the id', () => {
    expect(findOverlay(createHudScreen(), 'ghost')).toBeUndefined();
  });
});
