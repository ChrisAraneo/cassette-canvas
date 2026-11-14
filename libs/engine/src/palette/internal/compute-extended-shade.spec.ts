import { every, initial, map, range, sum, tail, values, zip } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_SHADE, EXTENDED_SHADE_COUNT, SHADE_COUNT } from '../consts';
import { computeExtendedShade } from './compute-extended-shade';
import { toExtendedShade } from './to-extended-shade';

const ORANGE = Object.freeze({ red: 200, green: 100, blue: 0 });

describe('computeExtendedShade', () => {
  it('should return the very same color when it reaches the base shade', () => {
    expect(computeExtendedShade(ORANGE, toExtendedShade(BASE_SHADE))).toBe(
      ORANGE,
    );
  });

  it('should return mostly black when it reaches the darkest sprite shade', () => {
    expect(computeExtendedShade(ORANGE, toExtendedShade(0))).toEqual({
      red: 40,
      green: 20,
      blue: 0,
    });
  });

  it('should return a little black when it reaches the sprite shade just below the base', () => {
    expect(
      computeExtendedShade(ORANGE, toExtendedShade(BASE_SHADE - 1)),
    ).toEqual({ red: 160, green: 80, blue: 0 });
  });

  it('should return a little white when it reaches the sprite shade just above the base', () => {
    expect(
      computeExtendedShade(ORANGE, toExtendedShade(BASE_SHADE + 1)),
    ).toEqual({ red: 214, green: 139, blue: 64 });
  });

  it('should return mostly white when it reaches the lightest sprite shade', () => {
    expect(
      computeExtendedShade(ORANGE, toExtendedShade(SHADE_COUNT - 1)),
    ).toEqual({ red: 241, green: 216, blue: 191 });
  });

  it('should return a quarter step past the base when it reaches the next extended shade', () => {
    expect(
      computeExtendedShade(ORANGE, toExtendedShade(BASE_SHADE) + 1),
    ).toEqual({ red: 203, green: 110, blue: 16 });
  });

  it('should return a color darker than any sprite shade when it reaches the darkest extended shade', () => {
    expect(computeExtendedShade(ORANGE, 0)).toEqual({
      red: 30,
      green: 15,
      blue: 0,
    });
  });

  it('should return a color lighter than any sprite shade when it reaches the lightest extended shade', () => {
    expect(computeExtendedShade(ORANGE, EXTENDED_SHADE_COUNT - 1)).toEqual({
      red: 248,
      green: 236,
      blue: 223,
    });
  });

  it('should return every extended shade lighter than the one before when it walks up the ramp', () => {
    const brightness = map(range(EXTENDED_SHADE_COUNT), (extendedShade) =>
      sum(values(computeExtendedShade(ORANGE, extendedShade))),
    );

    expect(
      every(
        zip(initial(brightness), tail(brightness)),
        ([darker = 0, lighter = 0]) => lighter > darker,
      ),
    ).toBe(true);
  });
});
