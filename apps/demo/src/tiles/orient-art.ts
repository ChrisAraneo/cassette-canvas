import { match } from 'ts-pattern';
import type { Heading } from './types/heading';
import { flipArt } from './flip-art';

/** Turns art drawn facing right to face `heading`. */
export const orientArt = (
  rows: readonly string[],
  heading: Heading,
): readonly string[] =>
  match(heading)
    .with('left', () => flipArt(rows))
    .with('right', () => rows)
    .exhaustive();
