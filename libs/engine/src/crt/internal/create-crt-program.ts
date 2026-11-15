import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { tryCreateProgram } from './try-create-program';
import type { CrtProgram } from './types/crt-program';

const { nonNullable } = P;

export const createCrtProgram = ({
  context,
}: {
  readonly context: WebGLRenderingContext | undefined;
}): CrtProgram => ({
  context,
  program: match(context)
    .with(nonNullable, (ready) => tryCreateProgram(ready))
    .otherwise(constant(undefined)),
});
