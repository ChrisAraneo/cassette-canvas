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
import { composeSkyPlacements } from './internal/compose-sky-placements';
import { composeStreetLights } from './internal/compose-street-lights';
import { composeWindowPlacements } from './internal/compose-window-placements';
import { computeLampLevel } from './internal/compute-lamp-level';
import { placeMover } from './internal/place-mover';
import type { StreetScenery } from './types/street-scenery';

/** The lamp glass glows once the lamps are at least half on. */
const LAMP_GLASS_LIT = 0.5;

const composeLampGlass = (darkness: number): SpritePlacement[] =>
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

const pickSkyline = (
  { skyline, nightSkyline }: StreetScenery,
  darkness: number,
): readonly SpritePlacement[] =>
  match(darkness >= SKYLINE_LIT)
    .with(true, () => nightSkyline)
    .otherwise(() => skyline);

const composeSprites = (
  scenery: StreetScenery,
  cycle: DayCycle,
  time: number,
): SpritePlacement[] => [
  ...composeSkyPlacements(cycle, time),
  ...pickSkyline(scenery, cycle.darkness),
  ...scenery.buildings,
  ...composeWindowPlacements(scenery.windows, cycle),
  ...scenery.sidewalk,
  ...composeLampGlass(cycle.darkness),
  ...flatMap(PEOPLE, (person) => placeMover(person, time)),
  ...scenery.road,
  ...flatMap(VEHICLES, (vehicle) => placeMover(vehicle, time)),
];

const composeCycleScreen = (
  scenery: StreetScenery,
  cycle: DayCycle,
  time: number,
): Screen => ({
  ...createScreen(DAY_SKY, -NIGHT_DEPTH * cycle.darkness),
  sprites: composeSprites(scenery, cycle, time),
  lights: composeStreetLights(cycle, time),
});

/**
 * Composes the street `time` milliseconds after the animation started. The
 * sky darkens through the ambient light as night falls. Windows, lamps, and
 * headlights light up, the stars come out, and people and cars keep moving.
 */
export const composeStreetScreen = (
  scenery: StreetScenery,
  time: number,
): Screen => composeCycleScreen(scenery, computeDayCycle(time), time);
