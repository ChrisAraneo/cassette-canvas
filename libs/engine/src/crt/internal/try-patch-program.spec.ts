import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { POSITION_ATTRIBUTE, POSITION_LOCATION } from '../consts';
import { tryPatchProgram } from './try-patch-program';

interface ProgramCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

const BIND_ATTRIBUTE_CALL_INDEX = 2;

const PROGRAM = Object.freeze({ name: 'program' });

const VERTEX_SHADER = Object.freeze({ name: 'vertex shader' });

const FRAGMENT_SHADER = Object.freeze({ name: 'fragment shader' });

const createContext = (
  calls: ProgramCall[],
  links: boolean,
): WebGLRenderingContext =>
  ({
    LINK_STATUS: 3,
    attachShader: (...values: unknown[]) =>
      calls.push({ name: 'attachShader', values }),
    bindAttribLocation: (...values: unknown[]) =>
      calls.push({ name: 'bindAttribLocation', values }),
    linkProgram: (...values: unknown[]) =>
      calls.push({ name: 'linkProgram', values }),
    getProgramParameter: () => links,
  }) as unknown as WebGLRenderingContext;

const tryPatchTestProgram = (
  calls: ProgramCall[],
  links: boolean,
): WebGLProgram | undefined =>
  tryPatchProgram(
    createContext(calls, links),
    PROGRAM,
    VERTEX_SHADER,
    FRAGMENT_SHADER,
  );

describe('tryPatchProgram', () => {
  it('should return the linked program when the shaders link', () => {
    expect(tryPatchTestProgram([], true)).toBe(PROGRAM);
  });

  it('should attach both shaders before it links them when it patches the program', () => {
    const calls: ProgramCall[] = [];

    tryPatchTestProgram(calls, true);

    expect(map(calls, (call) => call.name)).toEqual([
      'attachShader',
      'attachShader',
      'bindAttribLocation',
      'linkProgram',
    ]);
  });

  it('should bind the corners of the triangle to the shader when it patches the program', () => {
    const calls: ProgramCall[] = [];

    tryPatchTestProgram(calls, true);

    expect(calls[BIND_ATTRIBUTE_CALL_INDEX]?.values).toEqual([
      PROGRAM,
      POSITION_LOCATION,
      POSITION_ATTRIBUTE,
    ]);
  });

  it('should return no program when the shaders do not link', () => {
    expect(tryPatchTestProgram([], false)).toBeUndefined();
  });
});
