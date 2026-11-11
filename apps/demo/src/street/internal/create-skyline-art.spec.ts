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
  it('should cover the whole width for every row of the skyline', () => {
    expect([size(ART), uniq(map(ART, size))]).toEqual([
      SKYLINE_HEIGHT,
      [SCREEN_WIDTH],
    ]);
  });

  it('should leave the sky clear when there is no tower', () => {
    expect(symbolAt(SKYLINE_ROW + 20, 40)).toBe('.');
  });

  it('should leave the sky clear above a tower', () => {
    expect(symbolAt(TOWER.top - 1, TOWER.column + 1)).toBe('.');
  });

  it('should draw the roof of a tower as a plain wall', () => {
    expect(symbolAt(TOWER.top, TOWER.column + 1)).toBe('z');
  });

  it('should keep the windows off the edges of a tower', () => {
    expect(every(ART, (row) => !includes(WINDOWS, row[TOWER.column]))).toBe(
      true,
    );
  });

  it('should put windows in the tower below its roof', () => {
    expect(includes(WINDOWS, symbolAt(TOWER.top + 5, TOWER.column + 1))).toBe(
      true,
    );
  });
});
