import { match, P } from 'ts-pattern';
import { findCrtUniforms } from './internal/find-crt-uniforms';
import { tryCreateProgram } from './internal/try-create-program';
import { tryCreateTexture } from './internal/try-create-texture';
import { tryCreateVertices } from './internal/try-create-vertices';
import type { CrtDraft } from './internal/types/crt-draft';
import type { Crt } from './types/crt';

const { nonNullable } = P;

const createCrtDraft = (
  context: WebGLRenderingContext,
  program: WebGLProgram | undefined,
): CrtDraft => ({
  program,
  texture: tryCreateTexture(context),
  vertices: tryCreateVertices(context),
  uniforms: match(program)
    .with(nonNullable, (linked) => findCrtUniforms(context, linked))
    .otherwise(() => undefined),
});

const tryToCrt = (draft: CrtDraft): Crt | undefined =>
  match(draft)
    .with(
      {
        program: nonNullable,
        texture: nonNullable,
        vertices: nonNullable,
        uniforms: nonNullable,
      },
      (crt) => crt,
    )
    .otherwise(() => undefined);

/**
 * Sets up the monitor effect on a WebGL context: the shader program, the
 * texture that holds the frame, and a triangle that covers the canvas.
 * Returns `undefined` if there is no context or any step fails.
 */
export const tryCreateCrt = (
  context: WebGLRenderingContext | undefined,
): Crt | undefined =>
  match(context)
    .with(nonNullable, (ready) =>
      tryToCrt(createCrtDraft(ready, tryCreateProgram(ready))),
    )
    .otherwise(() => undefined);
