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
  it('should return the theme in the color of the window when the window carries one', () => {
    expect(toWindowTheme(createHud(15), WINDOW).color).toBe(9);
  });

  it('should return every shade of the HUD theme when it recolors it', () => {
    const hud = createHud(15);

    expect(toWindowTheme(hud, WINDOW)).toEqual({
      ...hud.theme,
      color: 9,
    });
  });
});
