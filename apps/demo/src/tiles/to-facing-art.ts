import { match } from 'ts-pattern';
import { toFlippedArt } from './internal/to-flipped-art';
import type { Heading } from './types/heading';

/** Turns art drawn facing right to face `heading`. */
export const toFacingArt = (
  rows: readonly string[],
  heading: Heading,
): readonly string[] =>
  match(heading)
    .with('LEFT', () => toFlippedArt(rows))
    .with('RIGHT', () => rows)
    .exhaustive();
