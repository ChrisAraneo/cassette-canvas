import { describe, expect, it } from 'vitest';

import { DEFAULT_HUD_COLOR } from './consts';
import { createHud } from './create-hud';
import { createHudTheme } from './create-hud-theme';

describe('createHud', () => {
  it('should hold no windows when it makes a HUD', () => {
    expect(createHud().windows).toEqual([]);
  });

  it('should hold nothing and take no keys when it makes a HUD', () => {
    expect([createHud().grab, createHud().focus]).toEqual([
      undefined,
      undefined,
    ]);
  });

  it('should take the beige-like color of the palette by default', () => {
    expect(createHud().theme).toEqual(createHudTheme(DEFAULT_HUD_COLOR));
  });

  it('should take the color it is given', () => {
    expect(createHud(9).theme).toEqual(createHudTheme(9));
  });
});
