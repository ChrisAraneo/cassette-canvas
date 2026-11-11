import { size } from 'lodash-es';
import { SPRITE_SIZE } from '../../consts';
import { SIDEWALK_ROW } from '../consts';
import type { Building } from '../types/building';

/** Returns the top row of a building that stands on the sidewalk. */
export const computeBuildingTop = ({ grid }: Pick<Building, 'grid'>): number =>
  SIDEWALK_ROW - size(grid) * SPRITE_SIZE;
