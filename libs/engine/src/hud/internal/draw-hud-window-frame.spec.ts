import { find, has, some } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { DEFAULT_HUD_COLOR } from '../consts';
import { createHud } from '../create-hud';
import type { HudWindow } from '../types/hud-window';
import { computeTitleRect } from './compute-title-rect';
import { drawHudWindowFrame } from './draw-hud-window-frame';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 10,
  column: 20,
  width: 90,
  height: 76,
  color: DEFAULT_HUD_COLOR,
  closable: true,
  page: '',
  widgets: [],
});

const THEME = createHud().theme;

const NOTE_COLOR = 9;

describe('drawHudWindowFrame', () => {
  it('should return the whole window filled with its body shade first when it paints one', () => {
    expect(drawHudWindowFrame(createHud(), WINDOW)[0]).toEqual({
      pixel: toPixel(DEFAULT_HUD_COLOR, THEME.body),
      row: 0,
      column: 0,
      width: 90,
      height: 76,
    });
  });

  it('should return the paint steps in the window, not where the window sits, when it paints one', () => {
    expect(drawHudWindowFrame(createHud(), WINDOW)[0]).toMatchObject({
      row: 0,
      column: 0,
    });
  });

  it('should return the title bar over the body when it paints a window', () => {
    expect(
      find(drawHudWindowFrame(createHud(), WINDOW), (paint) =>
        match(paint)
          .with({ pixel: toPixel(DEFAULT_HUD_COLOR, THEME.title) }, () => true)
          .otherwise(() => false),
      ),
    ).toMatchObject(computeTitleRect(WINDOW));
  });

  it('should return the title in the bar when it paints a window', () => {
    expect(
      some(drawHudWindowFrame(createHud(), WINDOW), (paint) =>
        has(paint, 'image'),
      ),
    ).toBe(true);
  });

  it('should return the color of the window when it paints one', () => {
    expect(
      drawHudWindowFrame(createHud(), { ...WINDOW, color: NOTE_COLOR })[0],
    ).toMatchObject({ pixel: toPixel(NOTE_COLOR, THEME.body) });
  });
});
