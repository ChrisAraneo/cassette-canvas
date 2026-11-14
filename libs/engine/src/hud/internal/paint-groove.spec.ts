import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudRect } from '../types/hud-rect';
import { paintGroove } from './paint-groove';

const LINE: HudRect = Object.freeze({
  row: 10,
  column: 4,
  width: 60,
  height: 2,
});

describe('paintGroove', () => {
  it('should return the shadow along the first row when it paints a groove', () => {
    expect(paintGroove(LINE, 0x13, 0x17)[0]).toEqual({
      pixel: 0x13,
      row: 10,
      column: 4,
      width: 60,
      height: 1,
    });
  });

  it('should return the light along the row below it when it paints a groove', () => {
    expect(paintGroove(LINE, 0x13, 0x17)[1]).toEqual({
      pixel: 0x17,
      row: 11,
      column: 4,
      width: 60,
      height: 1,
    });
  });

  it('should return two lines when it paints a groove', () => {
    expect(size(paintGroove(LINE, 0x13, 0x17))).toBe(2);
  });
});
