import {
  COLOR_COUNT,
  type DisplaySettings,
  EXTENDED_SHADES_PER_SHADE,
  type Light,
  type SpritePlacement,
  toPixel,
} from '@cassette-canvas/engine';
import {
  CLOUD,
  DEMO_COLORS,
  FLOWER,
  HEART,
  SKY,
  STONE,
  TREE_TOP,
  TREE_TRUNK,
  WALKER_STRIDE,
} from '../art/consts';

export const PIXEL_SIZE = 4;

export const SPRITE_SIZE = 8;

export const SCREEN_WIDTH = 320;

export const SCREEN_HEIGHT = 180;

export const DEMO_SETTINGS: DisplaySettings = Object.freeze({
  colors: DEMO_COLORS,
  pixelSize: PIXEL_SIZE,
  spriteSize: SPRITE_SIZE,
});

export const DAY_SKY = toPixel(SKY, 5);

export const NIGHT_DEPTH = 4 * EXTENDED_SHADES_PER_SHADE;

export const DAY_LENGTH = 16000;

export const SWATCH_TOP = 4;

export const SWATCH_LEFT = (SCREEN_WIDTH - COLOR_COUNT * SPRITE_SIZE) / 2;

export const GROUND_ROW = SCREEN_HEIGHT - SPRITE_SIZE;

export const STANDING_ROW = GROUND_ROW - SPRITE_SIZE;

export const WALKER_ID = 'walker';

export const HEART_ID = 'heart';

export const CLOUD_ID = 'cloud';

export const LANTERN_ID = 'lantern';

export const GLOW_ID = 'glow';

export const WALKER_PACE = 45;

export const WALKER_STEP_DURATION = 180;

export const LANTERN_ROW = STANDING_ROW + 4;

export const LANTERN_REACH = 6;

export const LANTERN_GLOW = 5 * EXTENDED_SHADES_PER_SHADE;

export const HEART_GLOW = 3 * EXTENDED_SHADES_PER_SHADE;

export const HEART_ROW = 120;

export const HEART_COLUMN = 156;

export const HEART_BOUNCE = 14;

export const HEART_PERIOD = 380;

export const GLOW_OFFSET = 4;

export const CLOUD_ROW = 84;

export const CLOUD_PACE = 110;

export const DEMO_SCENERY: readonly SpritePlacement[] = Object.freeze([
  {
    id: 'tree-left-top',
    sprite: TREE_TOP,
    row: STANDING_ROW - SPRITE_SIZE,
    column: 24,
    castsShadow: true,
  },
  {
    id: 'tree-left-trunk',
    sprite: TREE_TRUNK,
    row: STANDING_ROW,
    column: 24,
    castsShadow: true,
  },
  {
    id: 'pillar-left-top',
    sprite: STONE,
    row: STANDING_ROW - SPRITE_SIZE,
    column: 112,
    castsShadow: true,
  },
  {
    id: 'pillar-left-base',
    sprite: STONE,
    row: STANDING_ROW,
    column: 112,
    castsShadow: true,
  },
  {
    id: 'pillar-right-top',
    sprite: STONE,
    row: STANDING_ROW - 2 * SPRITE_SIZE,
    column: 200,
    castsShadow: true,
  },
  {
    id: 'pillar-right-middle',
    sprite: STONE,
    row: STANDING_ROW - SPRITE_SIZE,
    column: 200,
    castsShadow: true,
  },
  {
    id: 'pillar-right-base',
    sprite: STONE,
    row: STANDING_ROW,
    column: 200,
    castsShadow: true,
  },
  {
    id: 'tree-right-top',
    sprite: TREE_TOP,
    row: STANDING_ROW - SPRITE_SIZE,
    column: 288,
    castsShadow: true,
  },
  {
    id: 'tree-right-trunk',
    sprite: TREE_TRUNK,
    row: STANDING_ROW,
    column: 288,
    castsShadow: true,
  },
  {
    id: 'flower-left',
    sprite: FLOWER,
    row: STANDING_ROW,
    column: 64,
    castsShadow: false,
  },
  {
    id: 'flower-right',
    sprite: FLOWER,
    row: STANDING_ROW,
    column: 248,
    castsShadow: false,
  },
  {
    id: CLOUD_ID,
    sprite: CLOUD,
    row: CLOUD_ROW,
    column: SCREEN_WIDTH,
    castsShadow: false,
  },
  {
    id: HEART_ID,
    sprite: HEART,
    row: HEART_ROW,
    column: HEART_COLUMN,
    castsShadow: false,
  },
  {
    id: WALKER_ID,
    sprite: WALKER_STRIDE,
    row: STANDING_ROW,
    column: -SPRITE_SIZE,
    castsShadow: false,
  },
]);

export const DEMO_LIGHTS: readonly Light[] = Object.freeze([
  {
    id: LANTERN_ID,
    row: LANTERN_ROW,
    column: LANTERN_REACH - SPRITE_SIZE,
    radius: 44,
    intensity: LANTERN_GLOW,
  },
  {
    id: GLOW_ID,
    row: HEART_ROW + GLOW_OFFSET,
    column: HEART_COLUMN + GLOW_OFFSET,
    radius: 24,
    intensity: HEART_GLOW,
  },
]);
