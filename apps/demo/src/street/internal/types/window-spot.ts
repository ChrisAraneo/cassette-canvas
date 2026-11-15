import type { Building } from '../../types/building';
import type { GridCell } from './grid-cell';

/** One window of a building: the building it belongs to and its tile. */
export interface WindowSpot {
  readonly building: Building;
  readonly cell: GridCell;
}
