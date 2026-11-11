import { type Sprite, toPixel, toSprite } from '@cassette-canvas/engine';
import { map } from 'lodash-es';
import { toTiles } from '../../tiles/to-tiles';
import type { Tile } from '../../tiles/types/tile';
import { GRAY, YELLOW } from '../consts';

const SKY_LEGEND = Object.freeze({
  y: toPixel(YELLOW, 5),
  Y: toPixel(YELLOW, 6),
  W: toPixel(YELLOW, 7),
  o: toPixel(GRAY, 5),
  c: toPixel(GRAY, 6),
  w: toPixel(GRAY, 7),
});

export const SUN: readonly Tile[] = Object.freeze(
  toTiles(
    [
      '.....yyyyyy.....',
      '...yyYYYYYYyy...',
      '..yYYYYYYYYYYy..',
      '.yYYWWWYYYYYYYy.',
      '.yYWWWYYYYYYYYy.',
      'yYYWWYYYYYYYYYYy',
      'yYYWYYYYYYYYYYYy',
      'yYYYYYYYYYYYYYYy',
      'yYYYYYYYYYYYYYYy',
      'yYYYYYYYYYYYYYYy',
      'yYYYYYYYYYYYYYYy',
      '.yYYYYYYYYYYYYy.',
      '.yYYYYYYYYYYYYy.',
      '..yYYYYYYYYYYy..',
      '...yyYYYYYYyy...',
      '.....yyyyyy.....',
    ],
    SKY_LEGEND,
  ),
);

export const MOON: readonly Tile[] = Object.freeze(
  toTiles(
    [
      '................',
      '.....wwwwww.....',
      '...wwwwwwwwcc...',
      '..wwwwwwwoowcc..',
      '..wwoowwwwoocc..',
      '.wwwoowwwwwwwcc.',
      '.wwwwwwwwwwwwcc.',
      '.wwwwwwwwoowwcc.',
      '.wwwwwwwwoowwcc.',
      '.wwoowwwwwwwwcc.',
      '..wwoowwwwwwcc..',
      '..wwwwwwoowwcc..',
      '...wwwwwwwwcc...',
      '.....wwwwcc.....',
      '................',
      '................',
    ],
    SKY_LEGEND,
  ),
);

export const STAR_FRAMES: readonly Sprite[] = Object.freeze(
  map(
    [
      [
        '........',
        '........',
        '........',
        '...w....',
        '........',
        '........',
        '........',
        '........',
      ],
      [
        '........',
        '........',
        '...c....',
        '..cwc...',
        '...c....',
        '........',
        '........',
        '........',
      ],
    ],
    (rows) => toSprite(rows, SKY_LEGEND),
  ),
);

export const CLOUD_SHAPES: readonly (readonly Tile[])[] = Object.freeze(
  map(
    [
      [
        '............wwww................',
        '..........wwwwwwww..............',
        '.........wwwwwwwwww.wwww........',
        '.....www.wwwwwwwwwwwwwwwww......',
        '...wwwwwwwwwwwwwwwwwwwwwwwww....',
        '..wwwwwwwwwwwwwwwwwwwwwwwwwwww..',
        '.wwwwwwwwwwwwwwwwwwwwwwwwwwwwww.',
        '.ccwwwwwwwwwwwwwwwwwwwwwwwwwwcc.',
        '..cccccccccccccccccccccccccccc..',
        '....cccccccooooooooccccccccc....',
      ],
      [
        '........wwww............',
        '......wwwwwwww.www......',
        '...wwwwwwwwwwwwwwwww....',
        '.wwwwwwwwwwwwwwwwwwwww..',
        'cwwwwwwwwwwwwwwwwwwwwwwc',
        '.cccccccccccccccccccccc.',
        '...cccccooooooccccccc...',
      ],
      [
        '.....wwww.......',
        '...wwwwwwww.....',
        '.wwwwwwwwwwwww..',
        'cwwwwwwwwwwwwwwc',
        '.cccccccccccccc.',
      ],
    ],
    (rows) => toTiles(rows, SKY_LEGEND),
  ),
);
