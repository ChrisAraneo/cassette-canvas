import { describe, expect, it } from 'vitest';

import { writeShaderSource } from './write-shader-source';

const SHADER = Object.freeze({ name: 'shader' }) as unknown as WebGLShader;

const createContext = (calls: unknown[][]): WebGLRenderingContext =>
  ({
    shaderSource: (...values: unknown[]) => calls.push(values),
  }) as unknown as WebGLRenderingContext;

describe('writeShaderSource', () => {
  it('should pass the source to the shader when it writes the source', () => {
    const calls: unknown[][] = [];

    writeShaderSource(createContext(calls), SHADER, 'void main() {}');

    expect(calls).toEqual([[SHADER, 'void main() {}']]);
  });

  it('should pass an empty source when the shader has no source', () => {
    const calls: unknown[][] = [];

    writeShaderSource(createContext(calls), SHADER, '');

    expect(calls).toEqual([[SHADER, '']]);
  });

  it('should return the very same shader when it writes the source', () => {
    expect(writeShaderSource(createContext([]), SHADER, 'main')).toBe(SHADER);
  });
});
