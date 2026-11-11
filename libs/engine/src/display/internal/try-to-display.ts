import { match, P } from 'ts-pattern';
import type { Display } from '../types/display';
import type { DisplayDraft } from './types/display-draft';

const { nonNullable, number } = P;

const POSITIVE_INTEGER = number.int().positive();

export const tryToDisplay = (draft: DisplayDraft): Display | undefined =>
  match(draft)
    .with(
      {
        context: nonNullable,
        crt: nonNullable,
        pixelSize: POSITIVE_INTEGER,
        spriteSize: POSITIVE_INTEGER,
        width: POSITIVE_INTEGER,
        height: POSITIVE_INTEGER,
      },
      (display) => display,
    )
    .otherwise(() => undefined);
