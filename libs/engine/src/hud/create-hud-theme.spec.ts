import { every, values } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SHADE_COUNT } from '../palette/consts';
import { DEFAULT_HUD_COLOR, HUD_TEXT_SHADE } from './consts';
import { createHudTheme } from './create-hud-theme';

describe('createHudTheme', () => {
  it('should take the beige-like color of the palette by default', () => {
    expect(createHudTheme().color).toBe(DEFAULT_HUD_COLOR);
  });

  it('should take the color it is given', () => {
    expect(createHudTheme(9).color).toBe(9);
  });

  it('should write every letter in a dark shade', () => {
    expect(createHudTheme().text).toBe(HUD_TEXT_SHADE);
  });

  it('should keep every shade within the eight a sprite can use', () => {
    expect(
      every(
        values({ ...createHudTheme(), color: 0 }),
        (shade) => shade >= 0 && shade < SHADE_COUNT,
      ),
    ).toBe(true);
  });

  it('should make a button lighter than the window it sits on', () => {
    expect(createHudTheme().face).toBeGreaterThan(createHudTheme().body);
  });

  it('should make the text darker than every surface', () => {
    expect(createHudTheme().text).toBeLessThan(createHudTheme().title);
  });
});
