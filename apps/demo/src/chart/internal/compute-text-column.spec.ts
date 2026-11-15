import { describe, expect, it } from 'vitest';

import { GLYPH_GAP, GLYPH_PITCH } from '../../tiles/consts';
import { PANEL_WIDTH } from '../consts';
import { computeTextColumn } from './compute-text-column';

const TEXT_LENGTH = 3;

const PANEL_START = 0;

const FURTHER_PANEL_START = 200;

const ODD_PIXEL = 1;

describe('computeTextColumn', () => {
  it('should leave the same space on both sides when it centers text in a panel', () => {
    const column = computeTextColumn(TEXT_LENGTH, PANEL_START);
    const width = TEXT_LENGTH * GLYPH_PITCH - GLYPH_GAP;

    expect(
      Math.abs(column - (PANEL_WIDTH - column - width)),
    ).toBeLessThanOrEqual(ODD_PIXEL);
  });

  it('should give a column further right when the panel starts further right', () => {
    expect(computeTextColumn(4, FURTHER_PANEL_START)).toBe(
      FURTHER_PANEL_START + computeTextColumn(4, PANEL_START),
    );
  });
});
