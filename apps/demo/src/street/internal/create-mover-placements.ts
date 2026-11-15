import type { SpritePlacement } from '@cassette-canvas/engine';
import { floor, size } from 'lodash-es';
import { pipe } from 'remeda';
import { toTilePlacements } from '../../tiles/to-tile-placements';
import type { Tile } from '../../tiles/types/tile';
import type { Mover } from '../types/mover';
import { computeTrackColumn } from './compute-track-column';

const getMoverFrame = (
  { frames, frameDuration }: Mover,
  time: number,
): readonly Tile[] => frames[floor(time / frameDuration) % size(frames)] ?? [];

/** Places a mover where it is, in the frame it shows, at `time`. */
export const createMoverPlacements = (
  mover: Mover,
  time: number,
): SpritePlacement[] =>
  pipe(
    mover,
    (moving) => getMoverFrame(moving, time),
    (tiles) =>
      toTilePlacements(tiles, {
        id: mover.id,
        row: mover.row,
        column: computeTrackColumn(mover, time),
        castsShadow: mover.castsShadow,
      }),
  );
