import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudWindow } from '../types/hud-window';
import { toWindowTheme } from './to-window-theme';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 9,
  closable: true,
  page: '',
  widgets: [],
});

describe('toWindowTheme', () => {
  it('should put the theme on the color of the window', () => {
    expect(toWindowTheme(createHud(15), WINDOW).color).toBe(9);
  });

  it('should keep every shade of the HUD theme', () => {
    const hud = createHud(15);

    expect(toWindowTheme(hud, WINDOW)).toEqual({
      ...hud.theme,
      color: 9,
    });
  });
});
