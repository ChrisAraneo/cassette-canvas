import { chunk } from 'lodash-es';
import { SPRITE_SIZE } from '../../consts';
import type { TileArt } from './types/tile-art';
import type { TileBands } from './types/tile-bands';

/** Cuts the padded art into bands one sprite tall, top to bottom. */
export const computeTileBands = ({ art, legend }: TileArt): TileBands => ({
  bands: chunk(art, SPRITE_SIZE),
  legend,
});
