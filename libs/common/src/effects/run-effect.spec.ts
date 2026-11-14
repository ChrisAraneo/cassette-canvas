import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { runEffect } from './run-effect';

const SCENE = Object.freeze({ name: 'scene' });

describe('runEffect', () => {
  it('should return the very same value when it runs the effect', () => {
    const result = runEffect(SCENE, noop);

    expect(result).toBe(SCENE);
  });

  it('should pass the value to the effect when it runs', () => {
    const seen: string[] = [];

    runEffect('frame', (value) => seen.push(value));

    expect(seen).toEqual(['frame']);
  });
});
