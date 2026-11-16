import { floor } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudRect } from '../types/hud-rect';
import { computeTextColumn } from './compute-text-column';
import { computeTextWidth } from './compute-text-width';

const BUTTON_WIDTH = 60;

const RECT: HudRect = Object.freeze({
  row: 0,
  column: 10,
  width: BUTTON_WIDTH,
  height: 12,
});

describe('computeTextColumn', () => {
  it('should put the text in the middle of the button when it places one', () => {
    expect(computeTextColumn(RECT, 'SKIP', 0)).toBe(
      10 + floor((BUTTON_WIDTH - computeTextWidth('SKIP')) / 2),
    );
  });

  it('should move the text along when the button is pressed in', () => {
    expect(computeTextColumn(RECT, 'SKIP', 1)).toBe(
      computeTextColumn(RECT, 'SKIP', 0) + 1,
    );
  });

  it('should put the text at the left of the button when it is exactly as wide as the text', () => {
    expect(
      computeTextColumn(
        { ...RECT, width: computeTextWidth('SKIP') },
        'SKIP',
        0,
      ),
    ).toBe(10);
  });

  it('should put the middle of the text past the left edge when the text is wider than the button', () => {
    expect(computeTextColumn({ ...RECT, width: 0 }, 'SKIP', 0)).toBeLessThan(
      10,
    );
  });
});
