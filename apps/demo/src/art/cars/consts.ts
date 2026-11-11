import { type SpriteLegend, toPixel } from '@cassette-canvas/engine';
import { BLUE, GRAY, GREEN, PURPLE, RED, SKY, YELLOW } from '../consts';

/**
 * A car facing right, with its wheels turning over 2 frames. `b`, `B` and
 * `q` paint, `g` and `G` glass, `k` tires, `o` hubcaps, `h` headlight, `t`
 * taillight, `m` bumpers.
 */
export const CAR_FRAMES: readonly (readonly string[])[] = Object.freeze([
  [
    '........................',
    '........................',
    '........................',
    '........................',
    '.......qqqqqqqqq........',
    '......qgGggbgGggq.......',
    '.....bgGgggbgGgggb......',
    '....bbgggggbggggggb.....',
    '.qqqbbbbbbbbbbbbbbbqqqq.',
    'bbbbbbbbbbbbbbbbbbbbbbbb',
    'tbbbbbbbbbbbbbbbbbbbbbbh',
    'tbbbbbbbbbbbbbbbbbbbbbbh',
    'mBBBkkkkBBBBBBBBkkkkBBBm',
    '...kkookk......kkookk...',
    '....kkkk........kkkk....',
  ],
  [
    '........................',
    '........................',
    '........................',
    '........................',
    '.......qqqqqqqqq........',
    '......qgGggbgGggq.......',
    '.....bgGgggbgGgggb......',
    '....bbgggggbggggggb.....',
    '.qqqbbbbbbbbbbbbbbbqqqq.',
    'bbbbbbbbbbbbbbbbbbbbbbbb',
    'tbbbbbbbbbbbbbbbbbbbbbbh',
    'tbbbbbbbbbbbbbbbbbbbbbbh',
    'mBBBkkkkBBBBBBBBkkkkBBBm',
    '...kokkok......kokkok...',
    '....kkkk........kkkk....',
  ],
]);

const toPaintLegend = (paint: number): SpriteLegend =>
  Object.freeze({
    b: toPixel(paint, 4),
    B: toPixel(paint, 2),
    q: toPixel(paint, 6),
    g: toPixel(BLUE, 1),
    G: toPixel(SKY, 5),
    k: toPixel(GRAY, 0),
    o: toPixel(GRAY, 5),
    h: toPixel(YELLOW, 7),
    t: toPixel(RED, 6),
    m: toPixel(GRAY, 6),
  });

export const PAINTS = Object.freeze({
  red: toPaintLegend(RED),
  blue: toPaintLegend(BLUE),
  taxi: toPaintLegend(YELLOW),
  green: toPaintLegend(GREEN),
  silver: toPaintLegend(GRAY),
  purple: toPaintLegend(PURPLE),
});
