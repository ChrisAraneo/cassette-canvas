import { type Sprite, toPixel, toSprite } from '@cassette-canvas/engine';
import { toTiles } from '../../tiles/to-tiles';
import type { Tile } from '../../tiles/types/tile';
import { BROWN, GRAY, GREEN, YELLOW } from '../consts';

const STREET_LEGEND = Object.freeze({
  k: toPixel(GRAY, 1),
  K: toPixel(GRAY, 2),
  o: toPixel(GRAY, 4),
  O: toPixel(GRAY, 5),
  c: toPixel(GRAY, 6),
  w: toPixel(GRAY, 7),
  y: toPixel(YELLOW, 6),
  i: toPixel(GREEN, 1),
  I: toPixel(GREEN, 3),
  e: toPixel(GREEN, 2),
  g: toPixel(GREEN, 4),
  G: toPixel(GREEN, 6),
  b: toPixel(BROWN, 2),
  B: toPixel(BROWN, 1),
});

const LIT_LEGEND = Object.freeze({
  l: toPixel(YELLOW, 6),
  L: toPixel(YELLOW, 7),
});

export const SIDEWALK: Sprite = Object.freeze(
  toSprite(
    [
      'OOOOOOOo',
      'OOOOOOOo',
      'OOOOOOOo',
      'oooooooo',
      'OOOoOOOO',
      'OOOoOOOO',
      'OOOoOOOO',
      'oooooooo',
    ],
    STREET_LEGEND,
  ),
);

export const CURB: Sprite = Object.freeze(
  toSprite(
    [
      'cccccccc',
      'oooooooo',
      'kkkkkkkk',
      'KKKKKKKK',
      'KKKkKKKK',
      'KKKKKKkK',
      'KKKKKKKK',
      'KkKKKKKK',
    ],
    STREET_LEGEND,
  ),
);

export const ASPHALT: Sprite = Object.freeze(
  toSprite(
    [
      'KKKKKKKK',
      'KKKKKkKK',
      'KKKKKKKK',
      'KKkKKKKK',
      'KKKKKKKK',
      'KKKKKKKk',
      'KKKKKKKK',
      'kKKKKKKK',
    ],
    STREET_LEGEND,
  ),
);

export const LANE_MARK: Sprite = Object.freeze(
  toSprite(
    [
      'KKKKKKKK',
      'KKKKKkKK',
      'KKKKKKKK',
      'KKkKKKKK',
      'KKKKKKKK',
      'KKKKKKKk',
      'wwwwwKKK',
      'cccccKKK',
    ],
    STREET_LEGEND,
  ),
);

export const NEAR_CURB: Sprite = Object.freeze(
  toSprite(
    [
      'kkkkkkkk',
      'cccccccc',
      'OOOOOOOo',
      'OOOOOOOo',
      'oooooooo',
      'OOOoOOOO',
      'OOOoOOOO',
      'OOOoOOOO',
    ],
    STREET_LEGEND,
  ),
);

export const LAMP_POST: readonly Tile[] = Object.freeze(
  toTiles(
    [
      '...kk...',
      '..kkkk..',
      '.kkkkkk.',
      '.kcOOck.',
      '.kOccOk.',
      '.kcOOck.',
      '.kkkkkk.',
      '..kkkk..',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '...kK...',
      '..kkKK..',
      '..kkKK..',
      '..kkKK..',
      '.kkkkKK.',
      '.kkkkKK.',
      'kkkkkkKK',
    ],
    STREET_LEGEND,
  ),
);

/** The glass of a lit lamp, drawn over the top tile of the lamp post. */
export const LAMP_GLOW: Sprite = Object.freeze(
  toSprite(
    [
      '........',
      '........',
      '........',
      '..lLLl..',
      '..LLLL..',
      '..lLLl..',
      '........',
      '........',
    ],
    LIT_LEGEND,
  ),
);

export const TREE: readonly Tile[] = Object.freeze(
  toTiles(
    [
      '.........gGGg...........',
      '......ggGGGGGggg........',
      '....ggGGGGGGgggggg......',
      '...gGGGGGGggggggggg.....',
      '..gGGGGGgggggggggggge...',
      '..gGGGgggggGGgggggeee...',
      '.gGGGgggggGGGggggggeee..',
      '.gGGgggggggggggggggeee..',
      'gGGgggggggggggggggggeee.',
      'gGgggggGGggggggggggeeee.',
      'ggggggGGGgggggggggeeeee.',
      'gggggggggggggggggeeeeee.',
      '.gggggggggggggggeeeeee..',
      '.gggggggggggggeeeeeeee..',
      '..ggggggggggeeeeeeeee...',
      '...gggggeeeeeeeeeeee....',
      '....eeeeeeebbeeeeee.....',
      '......eeeeebBeeee.......',
      '..........bbB...........',
      '..........bbB...........',
      '..........bbB...........',
      '..........bbB...........',
      '..........bbB...........',
      '..........bbB...........',
      '..........bbB...........',
      '..........bbB...........',
      '.........bbbBB..........',
      '........bbbbBBB.........',
      '.......oOOOOOOOOo.......',
      '.......oooooooooo.......',
    ],
    STREET_LEGEND,
  ),
);
