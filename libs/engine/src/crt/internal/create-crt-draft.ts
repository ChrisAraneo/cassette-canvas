import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { findCrtUniforms } from './find-crt-uniforms';
import { tryCreateTexture } from './try-create-texture';
import { tryCreateVertices } from './try-create-vertices';
import type { CrtDraft } from './types/crt-draft';
import type { CrtProgram } from './types/crt-program';

const { nonNullable } = P;

export const createCrtDraft = ({ context, program }: CrtProgram): CrtDraft => ({
  program,
  texture: match(context)
    .with(nonNullable, (ready) => tryCreateTexture(ready))
    .otherwise(constant(undefined)),
  vertices: match(context)
    .with(nonNullable, (ready) => tryCreateVertices(ready))
    .otherwise(constant(undefined)),
  uniforms: match({ context, program })
    .with(
      { context: nonNullable, program: nonNullable },
      ({ context: ready, program: linked }) => findCrtUniforms(ready, linked),
    )
    .otherwise(constant(undefined)),
});
