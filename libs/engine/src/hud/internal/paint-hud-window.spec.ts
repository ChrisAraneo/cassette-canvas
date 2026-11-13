import { find, some } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import type { HudWindow } from '../types/hud-window';
import { computeTitleRect } from './compute-title-rect';
import { paintHudWindow } from './paint-hud-window';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 10,
  column: 20,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

const THEME = createHud().theme;

describe('paintHudWindow', () => {
  it('should fill the whole window with its body shade first', () => {
    expect(paintHudWindow(createHud(), WINDOW)[0]).toEqual({
      pixel: toPixel(15, THEME.body),
      row: 0,
      column: 0,
      width: 90,
      height: 76,
    });
  });

  it('should paint in the window, not where the window sits', () => {
    expect(paintHudWindow(createHud(), WINDOW)[0]).toMatchObject({
      row: 0,
      column: 0,
    });
  });

  it('should lay the title bar over the body', () => {
    expect(
      find(paintHudWindow(createHud(), WINDOW), (paint) =>
        match(paint)
          .with({ pixel: toPixel(15, THEME.title) }, () => true)
          .otherwise(() => false),
      ),
    ).toMatchObject(computeTitleRect(WINDOW));
  });

  it('should write the title into the bar', () => {
    expect(
      some(paintHudWindow(createHud(), WINDOW), (paint) => 'image' in paint),
    ).toBe(true);
  });

  it('should take the color of the window', () => {
    expect(
      paintHudWindow(createHud(), { ...WINDOW, color: 9 })[0],
    ).toMatchObject({ pixel: toPixel(9, THEME.body) });
  });
});
