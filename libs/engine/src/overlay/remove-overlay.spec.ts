import { describe, expect, it } from 'vitest';

import type { Screen } from '../screen/types/screen';
import { createOverlay } from './create-overlay';
import { removeOverlay } from './remove-overlay';

const PANEL = createOverlay(2, 1, 0x35);

const BADGE = createOverlay(1, 1, 0x17);

const createHudScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [],
  lights: [],
  overlays: [
    { id: 'panel', overlay: PANEL, row: 1, column: 2 },
    { id: 'badge', overlay: BADGE, row: 5, column: 6 },
  ],
});

describe('removeOverlay', () => {
  it('should take the overlay with the id off the screen', () => {
    expect(removeOverlay(createHudScreen(), 'panel').overlays).toEqual([
      { id: 'badge', overlay: BADGE, row: 5, column: 6 },
    ]);
  });

  it('should change nothing when no overlay has the id', () => {
    expect(removeOverlay(createHudScreen(), 'ghost')).toEqual(
      createHudScreen(),
    );
  });

  it('should not change the old screen when it removes an overlay', () => {
    const screen = createHudScreen();

    removeOverlay(screen, 'panel');

    expect(screen).toEqual(createHudScreen());
  });
});
