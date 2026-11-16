import { describe, expect, it } from 'vitest';

import { HUD_CARET_WIDTH } from '../consts';
import { computeCaretWidth } from './compute-caret-width';

describe('computeCaretWidth', () => {
  it('should leave room for the caret when the field has the focus', () => {
    expect(computeCaretWidth(true)).toBe(HUD_CARET_WIDTH);
  });

  it('should leave no room when the field does not have the focus', () => {
    expect(computeCaretWidth(false)).toBe(0);
  });
});
