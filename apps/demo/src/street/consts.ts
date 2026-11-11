import {
  EXTENDED_SHADES_PER_SHADE,
  type SpriteLegend,
  toPixel,
} from '@cassette-canvas/engine';
import { map, round } from 'lodash-es';
import { CAR_FRAMES, PAINTS } from '../art/cars/consts';
import { FACADE_LEGENDS } from '../art/city/consts';
import { SKY, YELLOW } from '../art/consts';
import { LOOKS, WALK_CYCLE } from '../art/people/consts';
import { CLOUD_SHAPES } from '../art/sky/consts';
import { orientArt } from '../tiles/orient-art';
import { toTiles } from '../tiles/to-tiles';
import type { Heading } from '../tiles/types/heading';
import type { Building } from './types/building';
import type { Mover } from './types/mover';
import type { Star } from './types/star';
import type { Tower } from './types/tower';
import type { Vehicle } from './types/vehicle';

export const SCREEN_WIDTH = 320;

export const SCREEN_HEIGHT = 180;

export const DAY_SKY = toPixel(SKY, 5);

/** How much darker the night is, in extended shades. */
export const NIGHT_DEPTH = 4 * EXTENDED_SHADES_PER_SHADE;

/** Movers leave the screen by this much before they come back. */
export const TRACK_MARGIN = 48;

export const TRACK_LENGTH = SCREEN_WIDTH + 2 * TRACK_MARGIN;

export const SIDEWALK_ROW = 128;

export const ROAD_ROW = 144;

export const LANE_MARK_ROW = 152;

export const NEAR_CURB_ROW = 176;

export const LANE_MARK_SPACING = 16;

/** The sun and the moon rise and set behind the buildings, at this row. */
export const HORIZON_ROW = 120;

export const ORBIT_CENTER = SCREEN_WIDTH / 2;

export const ORBIT_WIDTH = 184;

export const ORBIT_HEIGHT = 108;

/** The sun and the moon are 16 logical pixels wide. */
export const ORB_RADIUS = 8;

/** Below this height (from -1 to 1) the sun and the moon are not drawn. */
export const ORB_SET_HEIGHT = -0.2;

export const SUN_ID = 'sun';

export const MOON_ID = 'moon';

export const SUN_GLOW = Object.freeze({ radius: 28, intensity: 8 });

export const MOON_GLOW = Object.freeze({ radius: 16, intensity: 14 });

/** Lamps and headlights go on between these levels of darkness. */
export const LAMPS_ON = Object.freeze({ from: 0.3, to: 0.5 });

export const LAMP_COLUMNS: readonly number[] = Object.freeze([
  28, 92, 156, 220, 284,
]);

export const LAMP_ROW = 112;

/** Where the lamp light is, from the top-left pixel of the lamp post. */
export const LAMP_BULB = Object.freeze({ row: 4, column: 4 });

export const LAMP_LIGHT = Object.freeze({ radius: 40, intensity: 19 });

export const HEADLIGHT = Object.freeze({ radius: 28, intensity: 20 });

export const TREE_COLUMNS: readonly number[] = Object.freeze([
  49, 113, 177, 241,
]);

export const TREE_ROW = 108;

/** Home windows light up between these levels of darkness. */
export const WINDOW_DUSK = Object.freeze({ from: 0.35, to: 0.95 });

/** Home windows go dark between these hours after noon (21:00 to 3:00). */
export const WINDOW_BEDTIME = Object.freeze({ from: 9, to: 15 });

/** The share of lit windows that glow blue from a television. */
export const TV_SHARE = 0.2;

/** Shops light up at dusk and close at 22:00. */
export const SHOP_HOURS = Object.freeze({ dusk: 0.3, bedtime: 10 });

/** The stars come out when it is at least this dark. */
export const STARS_OUT = 0.6;

/** The windows of the distant skyline light up when it is this dark. */
export const SKYLINE_LIT = 0.7;

/** The share of skyline windows that light up at night. */
export const SKYLINE_LIT_SHARE = 0.45;

export const SKYLINE_ROW = 24;

export const SKYLINE_HEIGHT = 64;

const SKYLINE_WALLS = Object.freeze({
  z: toPixel(SKY, 4),
  w: toPixel(SKY, 3),
});

export const SKYLINE_DAY_LEGEND: SpriteLegend = Object.freeze({
  ...SKYLINE_WALLS,
  l: toPixel(SKY, 3),
});

export const SKYLINE_NIGHT_LEGEND: SpriteLegend = Object.freeze({
  ...SKYLINE_WALLS,
  l: toPixel(YELLOW, 6),
});

export const TOWERS: readonly Tower[] = Object.freeze([
  { column: 0, width: 20, top: 56 },
  { column: 22, width: 14, top: 40 },
  { column: 38, width: 24, top: 60 },
  { column: 64, width: 16, top: 34 },
  { column: 82, width: 22, top: 52 },
  { column: 106, width: 12, top: 44 },
  { column: 120, width: 26, top: 58 },
  { column: 148, width: 16, top: 30 },
  { column: 166, width: 22, top: 50 },
  { column: 190, width: 14, top: 62 },
  { column: 206, width: 20, top: 38 },
  { column: 228, width: 24, top: 54 },
  { column: 254, width: 14, top: 46 },
  { column: 270, width: 22, top: 36 },
  { column: 294, width: 26, top: 58 },
]);

export const BUILDINGS: readonly Building[] = Object.freeze([
  {
    id: 'townhouse',
    column: 0,
    legend: FACADE_LEGENDS.sand,
    grid: [
      'ccccc',
      'xWxWx',
      'xVxVx',
      'xWxWx',
      'xVxVx',
      'xWxWx',
      'xVxVx',
      'eeeee',
      'xWxDx',
      'xVxEx',
    ],
  },
  {
    id: 'grocery',
    column: 40,
    legend: FACADE_LEGENDS.orange,
    grid: ['cccccc', 'xWxxWx', 'xVxxVx', '~~~~~~', 'xSSDSx', 'xTTETx'],
  },
  {
    id: 'apartments',
    column: 88,
    legend: FACADE_LEGENDS.teal,
    grid: [
      'cccccc',
      'WxWWxW',
      'VxVVxV',
      'WxWWxW',
      'VxVVxV',
      'WxWWxW',
      'VxVVxV',
      'WxWWxW',
      'VxVVxV',
      'eeeeee',
      'xSSxDx',
      'xTTxEx',
    ],
  },
  {
    id: 'cottage',
    column: 136,
    legend: FACADE_LEGENDS.lime,
    grid: [
      '  h  ',
      ' LMR ',
      'LMMMR',
      'xWxWx',
      'xVxVx',
      'xxxxx',
      'xWxDx',
      'xVxEx',
    ],
  },
  {
    id: 'rowhouse',
    column: 176,
    legend: FACADE_LEGENDS.pink,
    grid: [
      'cccc',
      'xWWx',
      'xVVx',
      'xWWx',
      'xVVx',
      'xWWx',
      'xVVx',
      'eeee',
      'xWDx',
      'xVEx',
    ],
  },
  {
    id: 'cafe',
    column: 208,
    legend: FACADE_LEGENDS.purple,
    grid: [
      'cccccc',
      'xWxxWx',
      'xVxxVx',
      'xWxxWx',
      'xVxxVx',
      '~~~~~~',
      'SSDxSS',
      'TTExTT',
    ],
  },
  {
    id: 'office',
    column: 256,
    legend: FACADE_LEGENDS.gray,
    grid: [
      'ccccc',
      'WWWWW',
      'VVVVV',
      'WWWWW',
      'VVVVV',
      'WWWWW',
      'VVVVV',
      'eeeee',
      'SSDSS',
      'TTETT',
    ],
  },
  {
    id: 'brick',
    column: 296,
    legend: FACADE_LEGENDS.brick,
    grid: ['LMR', 'xWx', 'xVx', 'xWx', 'xVx', 'eee', 'xDx', 'xEx'],
  },
]);

/** A walking person moves the art forward by this much every frame. */
const STRIDE = 3;

const PERSON_ROWS = Object.freeze({ right: 124, left: 127 });

const PERSON_SPEEDS = Object.freeze({ right: 14, left: -11 });

const toPerson = (
  look: keyof typeof LOOKS,
  heading: Heading,
  offset: number,
): Mover => ({
  id: `person-${look}`,
  frames: map(WALK_CYCLE, (frame) =>
    toTiles(orientArt(frame, heading), LOOKS[look]),
  ),
  row: PERSON_ROWS[heading],
  speed: PERSON_SPEEDS[heading],
  offset,
  frameDuration: round((STRIDE * 1000) / Math.abs(PERSON_SPEEDS[heading])),
  castsShadow: true,
});

export const PEOPLE: readonly Mover[] = Object.freeze([
  toPerson('jogger', 'right', 20),
  toPerson('student', 'right', 150),
  toPerson('courier', 'right', 290),
  toPerson('artist', 'left', 60),
  toPerson('gardener', 'left', 200),
  toPerson('grandma', 'left', 330),
]);

const CAR_ROWS = Object.freeze({ right: 157, left: 142 });

const CAR_SPEEDS = Object.freeze({ right: 56, left: -40 });

/** Where the headlight is, from the top-left pixel of a car. */
const HEADLIGHTS = Object.freeze({
  right: { row: 11, column: 32 },
  left: { row: 11, column: -9 },
});

/** A turning wheel moves the car forward by this much every frame. */
const WHEEL_STEP = 2;

const toCar = (
  paint: keyof typeof PAINTS,
  heading: Heading,
  offset: number,
): Vehicle => ({
  id: `car-${paint}`,
  frames: map(CAR_FRAMES, (frame) =>
    toTiles(orientArt(frame, heading), PAINTS[paint]),
  ),
  row: CAR_ROWS[heading],
  speed: CAR_SPEEDS[heading],
  offset,
  frameDuration: round((WHEEL_STEP * 1000) / Math.abs(CAR_SPEEDS[heading])),
  castsShadow: true,
  headlight: HEADLIGHTS[heading],
});

export const VEHICLES: readonly Vehicle[] = Object.freeze([
  toCar('red', 'left', 0),
  toCar('taxi', 'left', 208),
  toCar('blue', 'right', 30),
  toCar('green', 'right', 169),
  toCar('purple', 'right', 308),
]);

const toCloud = (
  shape: number,
  row: number,
  speed: number,
  offset: number,
): Mover => ({
  id: `cloud-${row}`,
  frames: [CLOUD_SHAPES[shape] ?? []],
  row,
  speed,
  offset,
  frameDuration: 1000,
  castsShadow: false,
});

export const CLOUDS: readonly Mover[] = Object.freeze([
  toCloud(0, 8, -5, 40),
  toCloud(1, 26, -3, 180),
  toCloud(2, 16, -4, 300),
  toCloud(1, 40, -6, 110),
]);

export const STARS: readonly Star[] = Object.freeze([
  { id: 'star-0', row: 4, column: 12, period: 900 },
  { id: 'star-1', row: 18, column: 40, period: 1300 },
  { id: 'star-2', row: 6, column: 70, period: 1100 },
  { id: 'star-3', row: 26, column: 96, period: 700 },
  { id: 'star-4', row: 2, column: 118, period: 1500 },
  { id: 'star-5', row: 14, column: 142, period: 800 },
  { id: 'star-6', row: 30, column: 170, period: 1200 },
  { id: 'star-7', row: 8, column: 194, period: 1000 },
  { id: 'star-8', row: 20, column: 222, period: 1400 },
  { id: 'star-9', row: 4, column: 246, period: 750 },
  { id: 'star-10', row: 24, column: 268, period: 1150 },
  { id: 'star-11', row: 10, column: 292, period: 950 },
  { id: 'star-12', row: 34, column: 306, period: 1250 },
  { id: 'star-13', row: 36, column: 58, period: 1050 },
]);
