import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createCrtDraft } from './create-crt-draft';

const PROGRAM = Object.freeze({ name: 'program' });

const TEXTURE = Object.freeze({ name: 'texture' });

const BUFFER = Object.freeze({ name: 'buffer' });

const createContext = (texture: object | null): WebGLRenderingContext =>
  ({
    createTexture: () => texture,
    bindTexture: noop,
    texParameteri: noop,
    createBuffer: () => BUFFER,
    bindBuffer: noop,
    bufferData: noop,
    getUniformLocation: (_: unknown, name: string) => ({ name }),
  }) as unknown as WebGLRenderingContext;

describe('createCrtDraft', () => {
  it('should return the texture and the vertices when the context makes them', () => {
    const draft = createCrtDraft({
      context: createContext(TEXTURE),
      program: PROGRAM,
    });

    expect([draft.texture, draft.vertices]).toEqual([TEXTURE, BUFFER]);
  });

  it('should return the very same program it was given when it makes the draft', () => {
    expect(
      createCrtDraft({ context: createContext(TEXTURE), program: PROGRAM })
        .program,
    ).toBe(PROGRAM);
  });

  it('should return the places of the uniforms when there is a program', () => {
    expect(
      createCrtDraft({ context: createContext(TEXTURE), program: PROGRAM })
        .uniforms?.time,
    ).toEqual({ name: 'u_time' });
  });

  it('should return no uniforms when there is no program', () => {
    expect(
      createCrtDraft({ context: createContext(TEXTURE), program: undefined })
        .uniforms,
    ).toBeUndefined();
  });

  it('should return no texture when the context cannot make one', () => {
    expect(
      createCrtDraft({ context: createContext(null), program: PROGRAM })
        .texture,
    ).toBeUndefined();
  });

  it('should return no part at all when there is no context', () => {
    expect(createCrtDraft({ context: undefined, program: undefined })).toEqual({
      program: undefined,
      texture: undefined,
      vertices: undefined,
      uniforms: undefined,
    });
  });
});
