import { chunk, compact, join, map, size, some } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { isPixel } from '../palette/is-pixel';
import { TEXT_ASCENT, TEXT_GAP, TEXT_HEIGHT, TEXT_LINE_ROWS } from './consts';
import { measureText } from './measure-text';
import { toTextOverlay } from './to-text-overlay';

const INK = 0x15;

const toMark = (pixel: number): string =>
  match(isPixel(pixel))
    .with(true, () => '#')
    .otherwise(() => '.');

const toRows = (text: string): string[] =>
  map(chunk(toTextOverlay(text, INK).pixels, measureText(text)), (row) =>
    join(map(row, toMark), ''),
  );

const toInkedRows = (text: string): number[] =>
  compact(
    map(toRows(text), (row, index) =>
      match(some(row, (mark) => mark === '#'))
        .with(true, () => index + 1)
        .otherwise(() => 0),
    ),
  );

describe('toTextOverlay', () => {
  it('should take one line of rows whatever the text is', () => {
    expect(toTextOverlay('Hg', INK).height).toBe(TEXT_LINE_ROWS);
  });

  it('should be as wide as the text moves the pen', () => {
    expect(toTextOverlay('HI', INK).width).toBe(measureText('HI'));
  });

  it('should start a capital in the row below the ascent', () => {
    expect(toInkedRows('H')[0]).toBe(TEXT_ASCENT + 1);
  });

  it('should draw a capital exactly as tall as the text height', () => {
    expect(size(toInkedRows('H'))).toBe(TEXT_HEIGHT);
  });

  it('should let a tail reach below the capitals', () => {
    expect(toInkedRows('g')).toContain(TEXT_ASCENT + TEXT_HEIGHT + 1);
  });

  it('should draw the letters in the pixel it is given', () => {
    expect(toTextOverlay('H', INK).pixels).toContain(INK);
  });

  it('should leave the gap after a character transparent', () => {
    expect(toRows('H')[TEXT_ASCENT]).toBe('#...#.');
  });

  it('should leave the pen one gap past the last letter', () => {
    expect(toTextOverlay('H', INK).width - size('#...#')).toBe(TEXT_GAP);
  });

  it('should draw nothing for an empty text', () => {
    expect(toTextOverlay('', INK)).toEqual({
      width: 0,
      height: TEXT_LINE_ROWS,
      pixels: [],
    });
  });
});
