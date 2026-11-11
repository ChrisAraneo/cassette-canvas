import type { SpritePlacement } from '@cassette-canvas/engine';
import { floor, size } from 'lodash-es';
import { placeTiles } from '../../tiles/place-tiles';
import type { Tile } from '../../tiles/types/tile';
import type { Mover } from '../types/mover';
import { computeTrackColumn } from './compute-track-column';

const pickFrame = (
  { frames, frameDuration }: Mover,
  time: number,
): readonly Tile[] => frames[floor(time / frameDuration) % size(frames)] ?? [];

/** Places a mover where it is, in the frame it shows, at `time`. */
export const placeMover = (mover: Mover, time: number): SpritePlacement[] =>
  placeTiles(pickFrame(mover, time), {
    id: mover.id,
    row: mover.row,
    column: computeTrackColumn(mover, time),
    castsShadow: mover.castsShadow,
  });
