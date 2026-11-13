import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addOverlay } from './add-overlay';
import { createOverlay } from './create-overlay';
import type { Screen } from '../screen/types/screen';

const PANEL = createOverlay(2, 1, 0x35);

const BADGE = createOverlay(1, 1, 0x17);

const createHudScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [],
  lights: [],
  overlays: [{ id: 'panel', overlay: PANEL, row: 1, column: 2 }],
});

describe('addOverlay', () => {
  it('should place the overlay at the row and column when it adds it', () => {
    expect(
      addOverlay(createHudScreen(), 'badge', BADGE, 3, 4).overlays[1],
    ).toEqual({ id: 'badge', overlay: BADGE, row: 3, column: 4 });
  });

  it('should put the overlay on top of the others', () => {
    expect(
      map(
        addOverlay(createHudScreen(), 'badge', BADGE, 3, 4).overlays,
        (placement) => placement.id,
      ),
    ).toEqual(['panel', 'badge']);
  });

  it('should take the old overlay off when one with the same id is added', () => {
    expect(
      addOverlay(createHudScreen(), 'panel', BADGE, 9, 9).overlays,
    ).toEqual([{ id: 'panel', overlay: BADGE, row: 9, column: 9 }]);
  });

  it('should keep the very same sprites when it adds an overlay', () => {
    const screen = createHudScreen();

    expect(addOverlay(screen, 'badge', BADGE, 0, 0).sprites).toBe(
      screen.sprites,
    );
  });

  it('should not change the old screen when it adds an overlay', () => {
    const screen = createHudScreen();

    addOverlay(screen, 'badge', BADGE, 3, 4);

    expect(screen).toEqual(createHudScreen());
  });
});
