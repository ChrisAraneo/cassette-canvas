import { pipe } from 'remeda';
import { createCrtDraft } from './internal/create-crt-draft';
import { createCrtProgram } from './internal/create-crt-program';
import { tryToCrt } from './internal/try-to-crt';
import type { Crt } from './types/crt';

/**
 * Sets up the monitor effect on a WebGL context: the shader program, the
 * texture that holds the frame, and a triangle that covers the canvas.
 * Returns `undefined` if there is no context or any step fails.
 */
export const tryCreateCrt = (
  context: WebGLRenderingContext | undefined,
): Crt | undefined =>
  pipe({ context }, createCrtProgram, createCrtDraft, tryToCrt);
