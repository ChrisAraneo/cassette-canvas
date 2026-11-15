import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Crt } from '../types/crt';
import type { CrtDraft } from './types/crt-draft';

const { nonNullable } = P;

export const tryToCrt = (draft: CrtDraft): Crt | undefined =>
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
    .otherwise(constant(undefined));
