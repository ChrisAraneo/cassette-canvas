import type { Light } from '@cassette-canvas/engine';
import { flatMap, inRange, map } from 'lodash-es';
import { match } from 'ts-pattern';
import type { DayCycle } from '../../day/types/day-cycle';
import {
  HEADLIGHT,
  LAMP_BULB,
  LAMP_COLUMNS,
  LAMP_LIGHT,
  LAMP_ROW,
  MOON_GLOW,
  MOON_ID,
  ORB_SET_HEIGHT,
  SCREEN_WIDTH,
  SUN_GLOW,
  SUN_ID,
  VEHICLES,
} from '../consts';
import type { Orb } from '../types/orb';
import type { Vehicle } from '../types/vehicle';
import { computeLampLevel } from './compute-lamp-level';
import { computeOrb } from './compute-orb';
import { computeTrackColumn } from './compute-track-column';

const HALF_DAY = 0.5;

const toGlow = (
  id: string,
  { row, column, height }: Orb,
  { radius, intensity }: Pick<Light, 'radius' | 'intensity'>,
): Light[] =>
  match(height > ORB_SET_HEIGHT && intensity > 0)
    .with(true, () => [{ id, row, column, radius, intensity }])
    .otherwise(() => []);

const toLampLights = (level: number): Light[] =>
  map(LAMP_COLUMNS, (column, index) => ({
    id: `lamp-${index}`,
    row: LAMP_ROW + LAMP_BULB.row,
    column: column + LAMP_BULB.column,
    radius: LAMP_LIGHT.radius,
    intensity: LAMP_LIGHT.intensity * level,
  }));

const toHeadlight = (
  { id, row, headlight }: Vehicle,
  column: number,
  level: number,
): Light[] =>
  match(inRange(column, -HEADLIGHT.radius, SCREEN_WIDTH + HEADLIGHT.radius))
    .with(true, () => [
      {
        id: `${id}-headlight`,
        row: row + headlight.row,
        column,
        radius: HEADLIGHT.radius,
        intensity: HEADLIGHT.intensity * level,
      },
    ])
    .otherwise(() => []);

const toHeadlights = (level: number, time: number): Light[] =>
  flatMap(VEHICLES, (vehicle) =>
    toHeadlight(
      vehicle,
      computeTrackColumn(vehicle, time) + vehicle.headlight.column,
      level,
    ),
  );

const toNightLights = (level: number, time: number): Light[] =>
  match(level > 0)
    .with(true, () => [...toLampLights(level), ...toHeadlights(level, time)])
    .otherwise(() => []);

/**
 * Returns the lights at `time`: a glow around the sun by day and around the
 * moon by night, and the street lamps and headlights from dusk to dawn.
 * Lights that are off or far off the screen are left out, because every
 * light costs time to draw.
 */
export const composeStreetLights = (
  { phase, darkness }: DayCycle,
  time: number,
): Light[] => [
  ...toGlow(SUN_ID, computeOrb(phase), {
    radius: SUN_GLOW.radius,
    intensity: SUN_GLOW.intensity * (1 - darkness),
  }),
  ...toGlow(MOON_ID, computeOrb(phase + HALF_DAY), {
    radius: MOON_GLOW.radius,
    intensity: MOON_GLOW.intensity * darkness,
  }),
  ...toNightLights(computeLampLevel(darkness), time),
];
