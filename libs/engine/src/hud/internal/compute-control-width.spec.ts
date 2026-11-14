import { describe, expect, it } from 'vitest';

import { HUD_LABEL_PADDING } from '../consts';
import { computeControlWidth } from './compute-control-width';
import { computeTextWidth } from './compute-text-width';

describe('computeControlWidth', () => {
  it('should return the text width plus the padding on both sides when it measures a control', () => {
    expect(computeControlWidth('OK')).toBe(
      computeTextWidth('OK') + 2 * HUD_LABEL_PADDING,
    );
  });

  it('should return the padding on both sides when the text is empty', () => {
    expect(computeControlWidth('')).toBe(2 * HUD_LABEL_PADDING);
  });
});
