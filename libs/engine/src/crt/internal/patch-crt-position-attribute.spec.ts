import { describe, expect, it } from 'vitest';

import { POSITION_LOCATION } from '../consts';
import { patchCrtPositionAttribute } from './patch-crt-position-attribute';

const createContext = (enabled: unknown[]): WebGLRenderingContext =>
  ({
    enableVertexAttribArray: (location: unknown) => enabled.push(location),
  }) as unknown as WebGLRenderingContext;

describe('patchCrtPositionAttribute', () => {
  it('should switch on the position attribute when it patches the position attribute', () => {
    const enabled: unknown[] = [];

    patchCrtPositionAttribute(createContext(enabled));

    expect(enabled).toEqual([POSITION_LOCATION]);
  });

  it('should return the very same context when it patches the position attribute', () => {
    const context = createContext([]);

    expect(patchCrtPositionAttribute(context)).toBe(context);
  });
});
