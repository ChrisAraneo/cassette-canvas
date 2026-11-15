import { isPixel } from '@cassette-canvas/engine';
import { filter, some } from 'lodash-es';
import type { Tile } from '../types/tile';
import type { TileCandidates } from './types/tile-candidates';

/** Keeps the tiles that hold at least one visible pixel. */
export const filterDrawnTiles = ({
  candidates,
}: TileCandidates): readonly Tile[] =>
  filter(candidates, (candidate) => some(candidate.sprite, isPixel));
