import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { POSITION_ATTRIBUTE, POSITION_LOCATION } from '../consts';
import { tryLinkProgram } from './try-link-program';

interface ProgramCall {
  readonly name: string;
  readonly values: readonly unknown[];
}

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

const linkProgram = (calls: ProgramCall[], links: boolean) =>
  tryLinkProgram(
    createContext(calls, links),
    PROGRAM,
    VERTEX_SHADER,
    FRAGMENT_SHADER,
  );

describe('tryLinkProgram', () => {
  it('should give the linked program when the shaders link', () => {
    expect(linkProgram([], true)).toBe(PROGRAM);
  });

  it('should attach both shaders before it links the program', () => {
    const calls: ProgramCall[] = [];

    linkProgram(calls, true);

    expect(map(calls, (call) => call.name)).toEqual([
      'attachShader',
      'attachShader',
      'bindAttribLocation',
      'linkProgram',
    ]);
  });

  it('should feed the corners of the screen in through the position attribute', () => {
    const calls: ProgramCall[] = [];

    linkProgram(calls, true);

    expect(calls[2]?.values).toEqual([
      PROGRAM,
      POSITION_LOCATION,
      POSITION_ATTRIBUTE,
    ]);
  });

  it('should give no program when the shaders do not link', () => {
    expect(linkProgram([], false)).toBeUndefined();
  });
});
