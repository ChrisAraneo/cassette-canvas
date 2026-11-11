import { flatMap, map, split } from 'lodash-es';
import type { GridCell } from '../types/grid-cell';

/** Lists the tiles of a building grid, left to right and top to bottom. */
export const toGridCells = (grid: readonly string[]): GridCell[] =>
  flatMap(grid, (line, row) =>
    map(split(line, ''), (code, column) => ({ code, row, column })),
  );
