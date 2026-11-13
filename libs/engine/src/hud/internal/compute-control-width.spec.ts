import { describe, expect, it } from 'vitest';

import { HUD_LABEL_PADDING } from '../consts';
import { computeControlWidth } from './compute-control-width';
import { computeTextWidth } from './compute-text-width';

describe('computeControlWidth', () => {
  it('should leave room on both sides of the text', () => {
    expect(computeControlWidth('OK')).toBe(
      computeTextWidth('OK') + 2 * HUD_LABEL_PADDING,
    );
  });

  it('should still leave the padding for an empty text', () => {
    expect(computeControlWidth('')).toBe(2 * HUD_LABEL_PADDING);
  });
});
