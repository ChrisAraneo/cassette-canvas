import { map, max, padEnd, reduceRight, size, split } from 'lodash-es';
import { BLANK } from '../consts';

const toFlippedRow = (row: string, width: number): string =>
  reduceRight(
    split(padEnd(row, width, BLANK), ''),
    (flipped, symbol) => flipped + symbol,
    '',
  );

/**
 * Mirrors text art left to right, so a sprite that faces right faces left.
 * Short rows are padded with transparent pixels first, so the art stays
 * lined up.
 */
export const toFlippedArt = (rows: readonly string[]): string[] =>
  map(rows, (row) => toFlippedRow(row, max(map(rows, size)) ?? 0));
