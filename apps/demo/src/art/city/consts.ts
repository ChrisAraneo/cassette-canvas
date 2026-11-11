import { type SpriteLegend, toPixel } from '@cassette-canvas/engine';
import { toTiles } from '../../tiles/to-tiles';
import type { Tile } from '../../tiles/types/tile';
import {
  BLUE,
  BROWN,
  CYAN,
  GRAY,
  GREEN,
  INDIGO,
  LIME,
  ORANGE,
  PINK,
  PURPLE,
  RED,
  SAND,
  SKY,
  TEAL,
  YELLOW,
} from '../consts';

/**
 * Facade tiles, keyed by the code a building grid uses for them. Windows,
 * doors and shop windows are two tiles tall: the first code is the top half
 * and the second code is the bottom half.
 *
 * - `x` wall, `c` cornice, `e` ledge above the ground floor
 * - `W` and `V` window, `D` and `E` door, `S` and `T` shop window
 * - `~` awning, `L`, `M` and `R` pitched roof, `h` chimney
 */
export const FACADE_ARTS: Readonly<Record<string, readonly string[]>> =
  Object.freeze({
    x: [
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
    ],
    c: [
      'tttttttt',
      'tttttttt',
      'TTTTTTTT',
      'aTaTaTaT',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
    ],
    e: [
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
      'tttttttt',
      'TTTTTTTT',
      'aaaaaaaa',
      'aaaaaaaa',
      'aaaaaaaa',
    ],
    W: [
      'aaaaaaaa',
      'atttttta',
      'affffffa',
      'afGgggfa',
      'afgGggfa',
      'afggggfa',
      'afggggfa',
      'affffffa',
    ],
    V: [
      'afggggfa',
      'afggGgfa',
      'afgggGfa',
      'afggggfa',
      'afggggfa',
      'affffffa',
      'assssssa',
      'aaaaaaaa',
    ],
    D: [
      'aaaaaaaa',
      'tttttttt',
      'tddddddt',
      'tdDddDdt',
      'tdDddDdt',
      'tdDddDdt',
      'tddddddt',
      'tddddddt',
    ],
    E: [
      'tddddkdt',
      'tdDddDdt',
      'tdDddDdt',
      'tdDddDdt',
      'tddddddt',
      'tddddddt',
      'TTTTTTTT',
      'TTTTTTTT',
    ],
    S: [
      'tttttttt',
      'tggggggt',
      'tgGggggt',
      'tggGgggt',
      'tgggGggt',
      'tggggGgt',
      'tggggggt',
      'tggggggt',
    ],
    T: [
      'tggggggt',
      'tggggggt',
      'tggggggt',
      'tggggggt',
      'tttttttt',
      'tTTTTTTt',
      'tTTTTTTt',
      'TTTTTTTT',
    ],
    '~': [
      'MMNNMMNN',
      'mmnnmmnn',
      'mmnnmmnn',
      'mmnnmmnn',
      'mmnnmmnn',
      'mmnnmmnn',
      'amnaamna',
      'aaaaaaaa',
    ],
    L: [
      '.......r',
      '......RR',
      '.....rrr',
      '....RRRR',
      '...rrrrr',
      '..RRRRRR',
      '.rrrrrrr',
      'RRRRRRRR',
    ],
    M: [
      'rrrrrrrr',
      'RRRRRRRR',
      'rrrRrrrR',
      'RRRRRRRR',
      'rRrrrRrr',
      'RRRRRRRR',
      'rrrRrrrR',
      'RRRRRRRR',
    ],
    R: [
      'r.......',
      'RR......',
      'rrr.....',
      'RRRR....',
      'rrrrr...',
      'RRRRRR..',
      'rrrrrrr.',
      'RRRRRRRR',
    ],
    h: [
      '........',
      '..TTTT..',
      '..tttt..',
      '...aA...',
      '...aA...',
      '...aA...',
      '...aA...',
      '...aA...',
    ],
  });

/** The glass of a lit window, drawn over the `W` and `V` tiles. */
const LIT_WINDOW_ART: readonly string[] = Object.freeze([
  '........',
  '........',
  '........',
  '..LLll..',
  '..Llll..',
  '..llll..',
  '..llll..',
  '........',
  '..llll..',
  '..llll..',
  '..llll..',
  '..llll..',
  '..llll..',
  '........',
  '........',
  '........',
]);

/** The glass of a lit shop window, drawn over the `S` and `T` tiles. */
const LIT_SHOP_ART: readonly string[] = Object.freeze([
  '........',
  '.LLLLLL.',
  '.Llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '.llllll.',
  '........',
  '........',
  '........',
  '........',
]);

const WARM_LIGHT_LEGEND: SpriteLegend = Object.freeze({
  l: toPixel(YELLOW, 6),
  L: toPixel(YELLOW, 7),
});

const TV_LIGHT_LEGEND: SpriteLegend = Object.freeze({
  l: toPixel(CYAN, 5),
  L: toPixel(CYAN, 7),
});

/** A window lit by a lamp. */
export const WARM_WINDOW: readonly Tile[] = Object.freeze(
  toTiles(LIT_WINDOW_ART, WARM_LIGHT_LEGEND),
);

/** A window lit by a television. */
export const TV_WINDOW: readonly Tile[] = Object.freeze(
  toTiles(LIT_WINDOW_ART, TV_LIGHT_LEGEND),
);

export const LIT_SHOP: readonly Tile[] = Object.freeze(
  toTiles(LIT_SHOP_ART, WARM_LIGHT_LEGEND),
);

const GLASS = Object.freeze({
  f: toPixel(GRAY, 7),
  s: toPixel(GRAY, 5),
  g: toPixel(BLUE, 2),
  G: toPixel(SKY, 6),
  k: toPixel(YELLOW, 6),
});

const toFacadeLegend = (
  wall: number,
  trim: number,
  roof: number,
  awning: number,
): SpriteLegend =>
  Object.freeze({
    ...GLASS,
    a: toPixel(wall, 4),
    A: toPixel(wall, 3),
    t: toPixel(trim, 6),
    T: toPixel(trim, 4),
    d: toPixel(BROWN, 2),
    D: toPixel(BROWN, 1),
    r: toPixel(roof, 3),
    R: toPixel(roof, 2),
    m: toPixel(awning, 4),
    M: toPixel(awning, 2),
    n: toPixel(GRAY, 7),
    N: toPixel(GRAY, 5),
  });

export const FACADE_LEGENDS = Object.freeze({
  sand: toFacadeLegend(SAND, GRAY, BROWN, RED),
  brick: toFacadeLegend(RED, SAND, BROWN, GREEN),
  teal: toFacadeLegend(TEAL, GRAY, INDIGO, ORANGE),
  lime: toFacadeLegend(LIME, SAND, RED, RED),
  pink: toFacadeLegend(PINK, GRAY, PURPLE, TEAL),
  orange: toFacadeLegend(ORANGE, SAND, BROWN, BLUE),
  purple: toFacadeLegend(PURPLE, GRAY, INDIGO, YELLOW),
  gray: toFacadeLegend(GRAY, SAND, BROWN, PINK),
});
