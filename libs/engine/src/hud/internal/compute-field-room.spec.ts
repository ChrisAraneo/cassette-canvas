import { describe, expect, it } from 'vitest';

import { HUD_CARET_WIDTH, HUD_PADDING } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeFieldRoom } from './compute-field-room';

const FIELD_WIDTH = 80;

const RECT: HudRect = Object.freeze({
  row: 0,
  column: 0,
  width: FIELD_WIDTH,
  height: 12,
});

describe('computeFieldRoom', () => {
  it('should leave out the padding on both sides when the field does not have the focus', () => {
    expect(computeFieldRoom(RECT, false)).toBe(FIELD_WIDTH - 2 * HUD_PADDING);
  });

  it('should leave out the caret as well when the field has the focus', () => {
    expect(computeFieldRoom(RECT, true)).toBe(
      FIELD_WIDTH - 2 * HUD_PADDING - HUD_CARET_WIDTH,
    );
  });

  it('should leave less than no room when the field is narrower than its padding', () => {
    expect(computeFieldRoom({ ...RECT, width: 0 }, false)).toBe(
      -2 * HUD_PADDING,
    );
  });
});
