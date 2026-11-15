import { describe, expect, it } from 'vitest';

import type { CrtUniforms } from '../types/crt-uniforms';
import { tryToCrt } from './try-to-crt';

const PROGRAM = Object.freeze({ name: 'program' });

const TEXTURE = Object.freeze({ name: 'texture' });

const BUFFER = Object.freeze({ name: 'buffer' });

const UNIFORMS = Object.freeze({
  frame: { name: 'u_frame' },
  frameSize: { name: 'u_frameSize' },
  canvasSize: { name: 'u_canvasSize' },
  pixelSize: { name: 'u_pixelSize' },
  time: { name: 'u_time' },
}) as unknown as CrtUniforms;

const DRAFT = Object.freeze({
  program: PROGRAM,
  texture: TEXTURE,
  vertices: BUFFER,
  uniforms: UNIFORMS,
});

describe('tryToCrt', () => {
  it('should return the monitor when every part is there', () => {
    expect(tryToCrt(DRAFT)).toEqual(DRAFT);
  });

  it('should return no monitor when the program is missing', () => {
    expect(tryToCrt({ ...DRAFT, program: undefined })).toBeUndefined();
  });

  it('should return no monitor when the texture is missing', () => {
    expect(tryToCrt({ ...DRAFT, texture: undefined })).toBeUndefined();
  });

  it('should return no monitor when the vertices are missing', () => {
    expect(tryToCrt({ ...DRAFT, vertices: undefined })).toBeUndefined();
  });

  it('should return no monitor when the uniforms are missing', () => {
    expect(tryToCrt({ ...DRAFT, uniforms: undefined })).toBeUndefined();
  });
});
