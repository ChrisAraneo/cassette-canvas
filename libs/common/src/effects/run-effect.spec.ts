import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { runEffect } from './run-effect';

interface Scene {
  readonly name: string;
}

const createScene = (): Scene => ({ name: 'scene' });

const SCENE = Object.freeze(createScene());

describe('runEffect', () => {
  it('should return the very same value when it runs the effect', () => {
    const result = runEffect(SCENE, noop);

    expect(result).toBe(SCENE);
  });

  it('should leave the value it was given unchanged when it runs the effect', () => {
    const scene = createScene();

    runEffect(scene, noop);

    expect(scene).toEqual(createScene());
  });

  it('should pass the value to the effect when it runs', () => {
    const seen: string[] = [];

    runEffect('frame', (value) => seen.push(value));

    expect(seen).toEqual(['frame']);
  });
});
