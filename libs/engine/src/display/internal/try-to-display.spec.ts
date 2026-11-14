import { describe, expect, it } from 'vitest';

import type { Crt } from '../../crt/types/crt';
import { tryToDisplay } from './try-to-display';
import type { DisplayDraft } from './types/display-draft';

const CONTEXT = {} as unknown as WebGLRenderingContext;

const CRT = {} as unknown as Crt;

const createDraft = (): DisplayDraft => ({
  context: CONTEXT,
  crt: CRT,
  palette: {},
  pixelSize: 4,
  spriteSize: 8,
  width: 16,
  height: 12,
  fps: 640,
  drawnAt: Number.NEGATIVE_INFINITY,
});

describe('tryToDisplay', () => {
  it('should return the very same draft when every part is ready', () => {
    const draft = createDraft();

    expect(tryToDisplay(draft)).toBe(draft);
  });

  it('should return undefined when the canvas has no WebGL context', () => {
    expect(
      tryToDisplay({ ...createDraft(), context: undefined }),
    ).toBeUndefined();
  });

  it('should return undefined when the monitor effect could not be set up', () => {
    expect(tryToDisplay({ ...createDraft(), crt: undefined })).toBeUndefined();
  });

  it('should return undefined when the pixel size is zero', () => {
    expect(tryToDisplay({ ...createDraft(), pixelSize: 0 })).toBeUndefined();
  });

  it('should return undefined when the sprite size is a fraction', () => {
    expect(tryToDisplay({ ...createDraft(), spriteSize: 1.5 })).toBeUndefined();
  });

  it('should return undefined when the frame rate is zero', () => {
    expect(tryToDisplay({ ...createDraft(), fps: 0 })).toBeUndefined();
  });

  it('should return undefined when the frame rate is negative', () => {
    expect(tryToDisplay({ ...createDraft(), fps: -60 })).toBeUndefined();
  });

  it('should return the draft when the frame rate is a fraction, so half rates work', () => {
    const draft = { ...createDraft(), fps: 29.97 };

    expect(tryToDisplay(draft)).toBe(draft);
  });

  it('should return undefined when the canvas is too small for one pixel', () => {
    expect(
      tryToDisplay({ ...createDraft(), width: 0, height: 0 }),
    ).toBeUndefined();
  });
});
