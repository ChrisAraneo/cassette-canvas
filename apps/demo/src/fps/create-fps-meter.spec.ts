import { describe, expect, it } from 'vitest';

import { createFpsMeter } from './create-fps-meter';

describe('createFpsMeter', () => {
  it('should return an empty count with no frame rate when it starts measuring', () => {
    expect(createFpsMeter(1200)).toEqual({ since: 1200, frames: 0, fps: 0 });
  });
});
