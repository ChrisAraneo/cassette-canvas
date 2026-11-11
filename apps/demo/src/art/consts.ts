import {
  type PaletteColors,
  type Sprite,
  type SpriteLegend,
  toPixel,
  toSprite,
} from '@cassette-canvas/engine';

export const GRAY = 0;

export const RED = 1;

export const YELLOW = 3;

export const GREEN = 5;

export const SKY = 8;

export const BLUE = 9;

export const INDIGO = 10;

export const BROWN = 14;

export const SAND = 15;

export const DEMO_COLORS: PaletteColors = Object.freeze<PaletteColors>([
  '#7f7f7f',
  '#d23c3c',
  '#e07a2e',
  '#e6c23a',
  '#98c93c',
  '#3d9e4a',
  '#2e9c8f',
  '#3bb4d6',
  '#4a8fe0',
  '#3c56c8',
  '#5b42c2',
  '#8a45c8',
  '#c045b4',
  '#e0608f',
  '#8c5a36',
  '#d4a373',
]);

export const DEMO_LEGEND: SpriteLegend = Object.freeze({
  k: toPixel(GRAY, 0),
  o: toPixel(GRAY, 3),
  O: toPixel(GRAY, 5),
  c: toPixel(GRAY, 6),
  w: toPixel(GRAY, 7),
  r: toPixel(RED, 4),
  R: toPixel(RED, 6),
  y: toPixel(YELLOW, 5),
  e: toPixel(GREEN, 2),
  g: toPixel(GREEN, 4),
  G: toPixel(GREEN, 6),
  u: toPixel(BLUE, 5),
  U: toPixel(BLUE, 2),
  B: toPixel(BROWN, 1),
  h: toPixel(BROWN, 2),
  b: toPixel(BROWN, 3),
  s: toPixel(SAND, 5),
});

export const STONE: Sprite = Object.freeze(
  toSprite(
    [
      '.kkkkkk.',
      'kOOOOOok',
      'kOoooook',
      'kOoooook',
      'kOoooook',
      'kOoooook',
      'kooooook',
      '.kkkkkk.',
    ],
    DEMO_LEGEND,
  ),
);

export const HEART: Sprite = Object.freeze(
  toSprite(
    [
      '........',
      '.rr..rr.',
      'rRRrrrrr',
      'rRrrrrrr',
      '.rrrrrr.',
      '..rrrr..',
      '...rr...',
      '........',
    ],
    DEMO_LEGEND,
  ),
);

export const CLOUD: Sprite = Object.freeze(
  toSprite(
    [
      '........',
      '...cc...',
      '..cwwc..',
      '.cwwwwcc',
      'cwwwwwwc',
      '.cccccc.',
      '........',
      '........',
    ],
    DEMO_LEGEND,
  ),
);

export const TREE_TOP: Sprite = Object.freeze(
  toSprite(
    [
      '...gg...',
      '..gGgg..',
      '.gGgggg.',
      'gGgggggg',
      'ggggggge',
      '.ggggee.',
      '..eeee..',
      '...bb...',
    ],
    DEMO_LEGEND,
  ),
);

export const TREE_TRUNK: Sprite = Object.freeze(
  toSprite(
    [
      '...bb...',
      '...bB...',
      '...bB...',
      '..bbBB..',
      '...bB...',
      '...bB...',
      '..bbbB..',
      '.bbbbBB.',
    ],
    DEMO_LEGEND,
  ),
);

export const FLOWER: Sprite = Object.freeze(
  toSprite(
    [
      '........',
      '...y....',
      '..yry...',
      '...y....',
      '...g..y.',
      '..gg.yry',
      '...g..y.',
      '...g..g.',
    ],
    DEMO_LEGEND,
  ),
);

export const GRASS: Sprite = Object.freeze(
  toSprite(
    [
      'G.g..G.g',
      'gGggGggg',
      'gggegggg',
      'egggggeg',
      'bbBbbbBb',
      'bBbbBbbb',
      'bbbbbBbb',
      'BbbBbbbB',
    ],
    DEMO_LEGEND,
  ),
);

export const WALKER_STRIDE: Sprite = Object.freeze(
  toSprite(
    [
      '...hh...',
      '..hssh..',
      '...ss...',
      '..uuuu..',
      '.s.uu.s.',
      '...UU...',
      '..U..U..',
      '..k..k..',
    ],
    DEMO_LEGEND,
  ),
);

export const WALKER_GATHERED: Sprite = Object.freeze(
  toSprite(
    [
      '...hh...',
      '..hssh..',
      '...ss...',
      '..uuuu..',
      '..suus..',
      '...UU...',
      '...UU...',
      '...kk...',
    ],
    DEMO_LEGEND,
  ),
);

export const WALKER_FRAMES: readonly Sprite[] = Object.freeze([
  WALKER_STRIDE,
  WALKER_GATHERED,
]);
