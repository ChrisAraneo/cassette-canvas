import { describe, expect, it } from 'vitest';

import { DEFAULT_HUD_COLOR } from '../consts';
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
    expect(toWindowTheme(createHud(DEFAULT_HUD_COLOR), WINDOW).color).toBe(
      WINDOW.color,
    );
  });

  it('should return every shade of the HUD theme when it recolors it', () => {
    const hud = createHud(DEFAULT_HUD_COLOR);

    expect(toWindowTheme(hud, WINDOW)).toEqual({
      ...hud.theme,
      color: WINDOW.color,
    });
  });
});
