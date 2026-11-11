import type { CrtUniformNames } from './types/crt-uniform-names';

export const GLOW_STRENGTH = 0.6;

export const GLOW_THRESHOLD = 0.45;

export const GLOW_REACH = 2;

export const SCANLINE_DEPTH = 0.09;

export const GRAIN_AMOUNT = 0.015;

export const GRAIN_RATE = 24;

export const SURFACE_AMOUNT = 0.0125;

export const SURFACE_SCALE = 3;

export const POSITION_ATTRIBUTE = 'a_position';

export const POSITION_LOCATION = 0;

export const FULL_SCREEN_TRIANGLE: readonly number[] = Object.freeze([
  -1, -1, 3, -1, -1, 3,
]);

export const CRT_UNIFORM_NAMES: CrtUniformNames = Object.freeze({
  frame: 'u_frame',
  frameSize: 'u_frameSize',
  canvasSize: 'u_canvasSize',
  pixelSize: 'u_pixelSize',
  time: 'u_time',
});

export const CRT_CONTEXT_ATTRIBUTES: WebGLContextAttributes = Object.freeze({
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
});
