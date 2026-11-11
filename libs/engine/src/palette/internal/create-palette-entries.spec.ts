import { first, last, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BASE_SHADE, EXTENDED_SHADE_COUNT } from '../consts';
import { createPaletteEntries } from './create-palette-entries';
import { toExtendedShade } from './to-extended-shade';

const TEAL = Object.freeze({ red: 46, green: 156, blue: 143 });

describe('createPaletteEntries', () => {
  it('should give one entry per extended shade when it expands a color', () => {
    expect(size(createPaletteEntries(TEAL, 2))).toBe(EXTENDED_SHADE_COUNT);
  });

  it('should key the shades by the extended pixels of that color when it expands it', () => {
    const pixels = map(createPaletteEntries(TEAL, 2), ([pixel]) => pixel);

    expect([first(pixels), last(pixels)]).toEqual([64, 95]);
  });

  it('should keep the very same color when it reaches the base shade', () => {
    const entries = createPaletteEntries(TEAL, 2);

    expect(entries[toExtendedShade(BASE_SHADE)]?.[1]).toBe(TEAL);
  });
});
