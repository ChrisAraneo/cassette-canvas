import { describe, expect, it } from 'vitest';

import { DEFAULT_HUD_COLOR } from './consts';
import { createHud } from './create-hud';
import { createHudTheme } from './create-hud-theme';

describe('createHud', () => {
  it('should return no windows when it makes a HUD', () => {
    expect(createHud().windows).toEqual([]);
  });

  it('should return no grab and no focus when it makes a HUD', () => {
    expect([createHud().grab, createHud().focus]).toEqual([
      undefined,
      undefined,
    ]);
  });

  it('should return a theme of DEFAULT_HUD_COLOR when no color is given', () => {
    expect(createHud().theme).toEqual(createHudTheme(DEFAULT_HUD_COLOR));
  });

  it('should return a theme of the color it is given when it makes a HUD', () => {
    expect(createHud(9).theme).toEqual(createHudTheme(9));
  });
});
