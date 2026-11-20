import type { DisplayCanvas } from './display-canvas';

export interface DisplayContext extends DisplayCanvas {
  readonly context: WebGLRenderingContext | undefined;
}
