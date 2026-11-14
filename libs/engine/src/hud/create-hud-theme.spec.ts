import { every, values } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SHADE_COUNT } from '../palette/consts';
import { DEFAULT_HUD_COLOR, HUD_TEXT_SHADE } from './consts';
import { createHudTheme } from './create-hud-theme';

describe('createHudTheme', () => {
  it('should return DEFAULT_HUD_COLOR when no color is given', () => {
    expect(createHudTheme().color).toBe(DEFAULT_HUD_COLOR);
  });

  it('should return the color it is given when it makes a theme', () => {
    expect(createHudTheme(9).color).toBe(9);
  });

  it('should return HUD_TEXT_SHADE for the text when it makes a theme', () => {
    expect(createHudTheme().text).toBe(HUD_TEXT_SHADE);
  });

  it('should return every shade within the eight a sprite can use when it makes a theme', () => {
    expect(
      every(
        values({ ...createHudTheme(), color: 0 }),
        (shade) => shade >= 0 && shade < SHADE_COUNT,
      ),
    ).toBe(true);
  });

  it('should return a face lighter than the body when it makes a theme', () => {
    expect(createHudTheme().face).toBeGreaterThan(createHudTheme().body);
  });

  it('should return a text shade darker than the title when it makes a theme', () => {
    expect(createHudTheme().text).toBeLessThan(createHudTheme().title);
  });
});
