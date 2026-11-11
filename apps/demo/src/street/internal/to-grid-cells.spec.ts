import { describe, expect, it } from 'vitest';

import { toGridCells } from './to-grid-cells';

describe('toGridCells', () => {
  it('should list the tiles left to right and top to bottom when it reads a grid', () => {
    expect(toGridCells(['ab', 'c'])).toEqual([
      { code: 'a', row: 0, column: 0 },
      { code: 'b', row: 0, column: 1 },
      { code: 'c', row: 1, column: 0 },
    ]);
  });

  it('should list no tiles when the grid is empty', () => {
    expect(toGridCells([])).toEqual([]);
  });
});
