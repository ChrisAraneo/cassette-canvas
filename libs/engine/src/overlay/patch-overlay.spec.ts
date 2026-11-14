import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Screen } from '../screen/types/screen';
import { createOverlay } from './create-overlay';
import { patchOverlay } from './patch-overlay';

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

describe('patchOverlay', () => {
  it('should return the overlay moved when it gets a new row and column', () => {
    expect(
      patchOverlay(createHudScreen(), 'panel', { row: 10, column: 20 })
        .overlays[0],
    ).toEqual({ id: 'panel', overlay: PANEL, row: 10, column: 20 });
  });

  it('should return the new image when it gets one', () => {
    expect(
      patchOverlay(createHudScreen(), 'panel', { overlay: BADGE }).overlays[0]
        ?.overlay,
    ).toBe(BADGE);
  });

  it('should return the fields the changes leave out unchanged when it changes an overlay', () => {
    expect(
      patchOverlay(createHudScreen(), 'panel', { row: 10 }).overlays[0]?.column,
    ).toBe(2);
  });

  it('should return the same drawing order when it changes an overlay', () => {
    expect(
      map(
        patchOverlay(createHudScreen(), 'panel', { row: 10 }).overlays,
        (placement) => placement.id,
      ),
    ).toEqual(['panel', 'badge']);
  });

  it('should return the screen unchanged when no overlay has the id', () => {
    expect(patchOverlay(createHudScreen(), 'ghost', { row: 10 })).toEqual(
      createHudScreen(),
    );
  });
});
