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
  it('should return one line of rows when the text holds a capital and a tail', () => {
    expect(toTextOverlay('Hg', INK).height).toBe(TEXT_LINE_ROWS);
  });

  it('should return an overlay as wide as the text moves the pen when it draws one', () => {
    expect(toTextOverlay('HI', INK).width).toBe(measureText('HI'));
  });

  it('should return a capital starting in the row below the ascent when it draws one', () => {
    expect(toInkedRows('H')[0]).toBe(TEXT_ASCENT + 1);
  });

  it('should return a capital exactly as tall as the text height when it draws one', () => {
    expect(size(toInkedRows('H'))).toBe(TEXT_HEIGHT);
  });

  it('should return a tail reaching below the capitals when the character has one', () => {
    expect(toInkedRows('g')).toContain(TEXT_ASCENT + TEXT_HEIGHT + 1);
  });

  it('should return the letters in the pixel it is given when it draws a text', () => {
    expect(toTextOverlay('H', INK).pixels).toContain(INK);
  });

  it('should return a transparent gap after a character when it draws one', () => {
    expect(toRows('H')[TEXT_ASCENT]).toBe('#...#.');
  });

  it('should return a width one gap past the last letter when it draws a text', () => {
    expect(toTextOverlay('H', INK).width - size('#...#')).toBe(TEXT_GAP);
  });

  it('should return an empty overlay when the text is empty', () => {
    expect(toTextOverlay('', INK)).toEqual({
      width: 0,
      height: TEXT_LINE_ROWS,
      pixels: [],
    });
  });
});
