import { flatMap, map, split } from 'lodash-es';
import { pipe } from 'remeda';
import type { GridCell } from './types/grid-cell';

const toLineCells = (line: string, row: number): GridCell[] =>
  pipe(
    line,
    (text) => split(text, ''),
    (codes) => map(codes, (code, column) => ({ code, row, column })),
  );

/** Lists the tiles of a building grid, left to right and top to bottom. */
export const toGridCells = (grid: readonly string[]): GridCell[] =>
  flatMap(grid, toLineCells);
