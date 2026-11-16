import { describe, expect, it } from 'vitest';

import { createOverlay } from '../overlay/create-overlay';
import { findOverlay } from './find-overlay';
import type { Screen } from './types/screen';

const PANEL = createOverlay(2, 1, 0x35);

const createHudScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [],
  lights: [],
  overlays: [{ id: 'panel', overlay: PANEL, row: 1, column: 2 }],
});

const createBareScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [],
  lights: [],
  overlays: [],
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

  it('should return no overlay when no overlay has the id', () => {
    expect(findOverlay(createHudScreen(), 'ghost')).toBeUndefined();
  });

  it('should return no overlay when the screen holds no overlay', () => {
    expect(findOverlay(createBareScreen(), 'panel')).toBeUndefined();
  });

  it('should not change the screen it is given when it finds an overlay', () => {
    const screen = createHudScreen();

    findOverlay(screen, 'panel');

    expect(screen).toEqual(createHudScreen());
  });
});
