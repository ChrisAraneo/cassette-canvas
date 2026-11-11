import { map, max, padEnd, reduceRight, size, split } from 'lodash-es';

const BLANK = '.';

const flipRow = (row: string, width: number): string =>
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
export const flipArt = (rows: readonly string[]): string[] =>
  map(rows, (row) => flipRow(row, max(map(rows, size)) ?? 0));
