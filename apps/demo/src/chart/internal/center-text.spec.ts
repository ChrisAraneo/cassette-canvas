import { describe, expect, it } from 'vitest';

import { GLYPH_PITCH } from '../../tiles/place-text';
import { PANEL_WIDTH } from '../consts';
import { centerText } from './center-text';

describe('centerText', () => {
  it('should return a column with the same space on both sides when it centers text in a panel', () => {
    const column = centerText(3, 0);
    const width = 3 * GLYPH_PITCH - 1;

    expect(
      Math.abs(column - (PANEL_WIDTH - column - width)),
    ).toBeLessThanOrEqual(1);
  });

  it('should return a column further right when the panel starts further right', () => {
    expect(centerText(4, 200)).toBe(200 + centerText(4, 0));
  });
});
