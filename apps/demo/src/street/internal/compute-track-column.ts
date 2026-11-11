import { floor } from 'lodash-es';
import { pipe } from 'remeda';
import { MILLISECONDS_PER_SECOND } from '../../day/consts';
import { TRACK_LENGTH, TRACK_MARGIN } from '../consts';
import type { Mover } from '../types/mover';

/**
 * Returns the column of a mover's left edge `time` milliseconds after the
 * animation started. The track runs from `TRACK_MARGIN` left of the screen
 * to `TRACK_MARGIN` right of it, and wraps around at both ends.
 */
export const computeTrackColumn = (
  { speed, offset }: Pick<Mover, 'speed' | 'offset'>,
  time: number,
): number =>
  pipe(
    offset + (speed * time) / MILLISECONDS_PER_SECOND,
    (distance) => distance - floor(distance / TRACK_LENGTH) * TRACK_LENGTH,
    (position) => floor(position) - TRACK_MARGIN,
  );
