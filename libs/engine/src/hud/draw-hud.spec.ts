import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { HUD_OVERLAY_PREFIX } from './consts';
import { createHud } from './create-hud';
import { drawHud } from './draw-hud';
import type { Hud } from './types/hud';

const createTwoWindows = (): Hud =>
  addHudWindow(
    addHudWindow(createHud(), {
      id: 'street',
      title: 'STREET',
      row: 10,
      column: 20,
      width: 90,
      height: 40,
    }),
    { id: 'notes', title: 'NOTES', row: 30, column: 40, width: 70, height: 30 },
  );

describe('drawHud', () => {
  it('should return one overlay for every window when it draws the HUD', () => {
    expect(
      map(drawHud(createTwoWindows()), (placement) => placement.id),
    ).toEqual([`${HUD_OVERLAY_PREFIX}-street`, `${HUD_OVERLAY_PREFIX}-notes`]);
  });

  it('should return the overlay of the window on top last when it draws the HUD, so it draws over the others', () => {
    expect(drawHud(createTwoWindows())[1]?.id).toBe(
      `${HUD_OVERLAY_PREFIX}-notes`,
    );
  });

  it('should return every overlay where its window sits when it draws the HUD', () => {
    expect(drawHud(createTwoWindows())[1]).toMatchObject({
      row: 30,
      column: 40,
    });
  });

  it('should return no overlays when the HUD holds no windows', () => {
    expect(drawHud(createHud())).toEqual([]);
  });

  it('should not change the HUD it is given when it draws one', () => {
    const hud = createTwoWindows();

    drawHud(hud);

    expect(hud).toEqual(createTwoWindows());
  });
});
