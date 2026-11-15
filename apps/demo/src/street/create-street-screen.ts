import {
  createScreen,
  type Screen,
  type SpritePlacement,
} from '@cassette-canvas/engine';
import { flatMap, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { LAMP_GLOW } from '../art/street/consts';
import { computeDayCycle } from '../day/compute-day-cycle';
import type { DayCycle } from '../day/types/day-cycle';
import {
  DAY_SKY,
  LAMP_COLUMNS,
  LAMP_ROW,
  NIGHT_DEPTH,
  PEOPLE,
  SKYLINE_LIT,
  VEHICLES,
} from './consts';
import { computeLampLevel } from './internal/compute-lamp-level';
import { createMoverPlacements } from './internal/create-mover-placements';
import { createSkyPlacements } from './internal/create-sky-placements';
import { createStreetLights } from './internal/create-street-lights';
import { createWindowPlacements } from './internal/create-window-placements';
import type { StreetScenery } from './types/street-scenery';

const LAMP_GLASS_LIT = 0.5;

const createLampGlass = (darkness: number): SpritePlacement[] =>
  match(computeLampLevel(darkness) >= LAMP_GLASS_LIT)
    .with(true, () =>
      map(LAMP_COLUMNS, (column, index) => ({
        id: `lamp-glass-${index}`,
        sprite: LAMP_GLOW,
        row: LAMP_ROW,
        column,
        castsShadow: false,
      })),
    )
    .otherwise(() => []);

const getSkyline = (
  { skyline, nightSkyline }: StreetScenery,
  darkness: number,
): readonly SpritePlacement[] =>
  match(darkness >= SKYLINE_LIT)
    .with(true, () => nightSkyline)
    .otherwise(() => skyline);

const createStreetSprites = (
  scenery: StreetScenery,
  cycle: DayCycle,
  time: number,
): SpritePlacement[] => [
  ...createSkyPlacements(cycle, time),
  ...getSkyline(scenery, cycle.darkness),
  ...scenery.buildings,
  ...createWindowPlacements(scenery.windows, cycle),
  ...scenery.sidewalk,
  ...createLampGlass(cycle.darkness),
  ...flatMap(PEOPLE, (person) => createMoverPlacements(person, time)),
  ...scenery.road,
  ...flatMap(VEHICLES, (vehicle) => createMoverPlacements(vehicle, time)),
];

const createCycleScreen = (
  scenery: StreetScenery,
  cycle: DayCycle,
  time: number,
): Screen => ({
  ...createScreen(DAY_SKY, -NIGHT_DEPTH * cycle.darkness),
  sprites: createStreetSprites(scenery, cycle, time),
  lights: createStreetLights(cycle, time),
});

/**
 * Composes the street `time` milliseconds after the animation started. The
 * sky darkens through the ambient light as night falls. Windows, lamps, and
 * headlights light up, the stars come out, and people and cars keep moving.
 */
export const createStreetScreen = (
  scenery: StreetScenery,
  time: number,
): Screen => createCycleScreen(scenery, computeDayCycle(time), time);
