import { TRANSPARENT } from '@cassette-canvas/engine';
import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Tile } from '../types/tile';
import { filterDrawnTiles } from './filter-drawn-tiles';

const DRAWN: Tile = Object.freeze({
  sprite: Object.freeze([0x14]),
  row: 0,
  column: 0,
});

const BLANK: Tile = Object.freeze({
  sprite: Object.freeze(times(2, () => TRANSPARENT)),
  row: 0,
  column: 8,
});

const CANDIDATES: readonly Tile[] = Object.freeze([DRAWN, BLANK]);

describe('filterDrawnTiles', () => {
  it('should keep the tiles that hold a pixel when some tiles are blank', () => {
    expect(filterDrawnTiles({ candidates: CANDIDATES })).toEqual([DRAWN]);
  });

  it('should keep every tile when every tile holds a pixel', () => {
    expect(filterDrawnTiles({ candidates: [DRAWN] })).toEqual([DRAWN]);
  });

  it('should give no tiles when there are no candidates', () => {
    expect(filterDrawnTiles({ candidates: [] })).toEqual([]);
  });

  it('should not change the old candidates when it drops the blank tiles', () => {
    filterDrawnTiles({ candidates: CANDIDATES });

    expect(map(CANDIDATES, 'column')).toEqual([0, 8]);
  });
});
