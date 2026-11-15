import type { SpritePlacement } from '@cassette-canvas/engine';
import { filter, flatMap } from 'lodash-es';
import { pipe } from 'remeda';
import { HOURS_PER_DAY } from '../../day/consts';
import type { DayCycle } from '../../day/types/day-cycle';
import { toFraction } from '../../math/to-fraction';
import { HALF_DAY } from '../consts';
import type { LitWindow } from '../types/lit-window';

const toHoursAfterNoon = (phase: number): number =>
  toFraction(phase + HALF_DAY) * HOURS_PER_DAY;

const isLit = (
  { dusk, bedtime }: LitWindow,
  darkness: number,
  hoursAfterNoon: number,
): boolean => darkness >= dusk && hoursAfterNoon < bedtime;

/** Places the glow of every window that is lit at this time of day. */
export const createWindowPlacements = (
  windows: readonly LitWindow[],
  { phase, darkness }: DayCycle,
): SpritePlacement[] =>
  pipe(
    windows,
    (all) =>
      filter(all, (litWindow) =>
        isLit(litWindow, darkness, toHoursAfterNoon(phase)),
      ),
    (lit) => flatMap(lit, (litWindow) => litWindow.placements),
  );
