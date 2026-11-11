import type { SpritePlacement } from '@cassette-canvas/engine';
import { filter, flatMap } from 'lodash-es';
import { HOURS_PER_DAY } from '../../day/consts';
import type { DayCycle } from '../../day/types/day-cycle';
import { toFraction } from '../../math/to-fraction';
import type { LitWindow } from '../types/lit-window';

const HALF_DAY = 0.5;

const toHoursAfterNoon = (phase: number): number =>
  toFraction(phase + HALF_DAY) * HOURS_PER_DAY;

const isLit = (
  { dusk, bedtime }: LitWindow,
  darkness: number,
  hoursAfterNoon: number,
): boolean => darkness >= dusk && hoursAfterNoon < bedtime;

/** Places the glow of every window that is lit at this time of day. */
export const composeWindowPlacements = (
  windows: readonly LitWindow[],
  { phase, darkness }: DayCycle,
): SpritePlacement[] =>
  flatMap(
    filter(windows, (litWindow) =>
      isLit(litWindow, darkness, toHoursAfterNoon(phase)),
    ),
    (litWindow) => litWindow.placements,
  );
