import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { CRT_UNIFORM_NAMES } from '../consts';
import { FRAGMENT_SHADER_SOURCE } from './fragment-shader-source';
import { findCrtUniforms } from './find-crt-uniforms';

const PROGRAM = Object.freeze({ name: 'program' });

const createContext = (missing: string | undefined): WebGLRenderingContext =>
  ({
    getUniformLocation: (_: unknown, name: string) =>
      match(name === missing)
        .with(true, () => null)
        .otherwise(() => ({ name })),
  }) as unknown as WebGLRenderingContext;

describe('findCrtUniforms', () => {
  it('should return every uniform of the monitor shader when the program has them all', () => {
    expect(findCrtUniforms(createContext(undefined), PROGRAM)).toEqual({
      frame: { name: CRT_UNIFORM_NAMES.frame },
      frameSize: { name: CRT_UNIFORM_NAMES.frameSize },
      canvasSize: { name: CRT_UNIFORM_NAMES.canvasSize },
      pixelSize: { name: CRT_UNIFORM_NAMES.pixelSize },
      time: { name: CRT_UNIFORM_NAMES.time },
    });
  });

  it('should return undefined when the program lacks one of them', () => {
    expect(
      findCrtUniforms(createContext(CRT_UNIFORM_NAMES.time), PROGRAM),
    ).toBeUndefined();
  });

  it('should name only the uniforms the fragment shader declares when it looks them up', () => {
    expect(FRAGMENT_SHADER_SOURCE).toContain(
      `uniform float ${CRT_UNIFORM_NAMES.time};`,
    );
    expect(FRAGMENT_SHADER_SOURCE).toContain(
      `uniform sampler2D ${CRT_UNIFORM_NAMES.frame};`,
    );
  });
});
