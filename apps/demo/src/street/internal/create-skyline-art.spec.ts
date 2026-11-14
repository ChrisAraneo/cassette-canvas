import { every, includes, map, size, uniq } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SCREEN_WIDTH, SKYLINE_HEIGHT, SKYLINE_ROW } from '../consts';
import { createSkylineArt } from './create-skyline-art';

const TOWER = Object.freeze({ column: 10, width: 12, top: SKYLINE_ROW + 4 });

const ART = createSkylineArt([TOWER]);

const WINDOWS: readonly (string | undefined)[] = Object.freeze(['w', 'l']);

const symbolAt = (row: number, column: number): string | undefined =>
  ART[row - SKYLINE_ROW]?.[column];

describe('createSkylineArt', () => {
  it('should return every row at the whole width of the skyline when it makes the art', () => {
    expect([size(ART), uniq(map(ART, size))]).toEqual([
      SKYLINE_HEIGHT,
      [SCREEN_WIDTH],
    ]);
  });

  it('should return a clear sky when there is no tower', () => {
    expect(symbolAt(SKYLINE_ROW + 20, 40)).toBe('.');
  });

  it('should return a clear sky above a tower when it makes the art', () => {
    expect(symbolAt(TOWER.top - 1, TOWER.column + 1)).toBe('.');
  });

  it('should return the roof of a tower as a plain wall when it makes the art', () => {
    expect(symbolAt(TOWER.top, TOWER.column + 1)).toBe('z');
  });

  it('should return no windows on the edges of a tower when it makes the art', () => {
    expect(every(ART, (row) => !includes(WINDOWS, row[TOWER.column]))).toBe(
      true,
    );
  });

  it('should return windows in the tower below its roof when it makes the art', () => {
    expect(includes(WINDOWS, symbolAt(TOWER.top + 5, TOWER.column + 1))).toBe(
      true,
    );
  });
});
