import {
  patchAmbient,
  patchLight,
  patchSprite,
  type Screen,
  type Sprite,
} from '@cassette-canvas/engine';
import { floor, nth, round, size } from 'lodash-es';
import { pipe } from 'remeda';
import { WALKER_FRAMES, WALKER_STRIDE } from '../art/consts';
import {
  CLOUD_ID,
  CLOUD_PACE,
  DAY_LENGTH,
  GLOW_ID,
  GLOW_OFFSET,
  HEART_BOUNCE,
  HEART_COLUMN,
  HEART_GLOW,
  HEART_ID,
  HEART_PERIOD,
  HEART_ROW,
  LANTERN_GLOW,
  LANTERN_ID,
  LANTERN_REACH,
  NIGHT_DEPTH,
  SCREEN_WIDTH,
  SPRITE_SIZE,
  WALKER_ID,
  WALKER_PACE,
  WALKER_STEP_DURATION,
} from './consts';

const TRACK_LENGTH = SCREEN_WIDTH + SPRITE_SIZE;

const FULL_TURN = 2 * Math.PI;

const computeWalkerColumn = (time: number): number =>
  (floor(time / WALKER_PACE) % TRACK_LENGTH) - SPRITE_SIZE;

const computeWalkerSprite = (time: number): Sprite =>
  nth(
    WALKER_FRAMES,
    floor(time / WALKER_STEP_DURATION) % size(WALKER_FRAMES),
  ) ?? WALKER_STRIDE;

const computeHeartRow = (time: number): number =>
  HEART_ROW - round(Math.abs(Math.sin(time / HEART_PERIOD)) * HEART_BOUNCE);

const computeCloudColumn = (time: number): number =>
  SCREEN_WIDTH - (floor(time / CLOUD_PACE) % TRACK_LENGTH);

const computeDarkness = (time: number): number =>
  (1 + Math.cos((FULL_TURN * time) / DAY_LENGTH)) / 2;

export const patchDemoScreen = (screen: Screen, time: number): Screen =>
  pipe(
    screen,
    (scene) =>
      patchSprite(scene, WALKER_ID, {
        sprite: computeWalkerSprite(time),
        column: computeWalkerColumn(time),
      }),
    (scene) =>
      patchLight(scene, LANTERN_ID, {
        column: computeWalkerColumn(time) + LANTERN_REACH,
        intensity: LANTERN_GLOW * computeDarkness(time),
      }),
    (scene) => patchSprite(scene, HEART_ID, { row: computeHeartRow(time) }),
    (scene) =>
      patchLight(scene, GLOW_ID, {
        row: computeHeartRow(time) + GLOW_OFFSET,
        column: HEART_COLUMN + GLOW_OFFSET,
        intensity: HEART_GLOW * computeDarkness(time),
      }),
    (scene) =>
      patchSprite(scene, CLOUD_ID, { column: computeCloudColumn(time) }),
    (scene) => patchAmbient(scene, -NIGHT_DEPTH * computeDarkness(time)),
  );
