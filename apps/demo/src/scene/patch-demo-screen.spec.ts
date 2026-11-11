import { findLight, findSprite } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { WALKER_GATHERED, WALKER_STRIDE } from '../art/consts';
import {
  CLOUD_ID,
  CLOUD_PACE,
  DAY_LENGTH,
  GLOW_ID,
  GLOW_OFFSET,
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
import { createDemoScreen } from './create-demo-screen';
import { patchDemoScreen } from './patch-demo-screen';

const TRACK_LENGTH = SCREEN_WIDTH + SPRITE_SIZE;

const MID_BOUNCE = (Math.PI / 2) * HEART_PERIOD;

describe('patchDemoScreen', () => {
  it('should keep the walker off the left edge when no time has passed', () => {
    expect(
      findSprite(patchDemoScreen(createDemoScreen(), 0), WALKER_ID)?.column,
    ).toBe(-SPRITE_SIZE);
  });

  it('should walk the walker one pixel right when one pace has passed', () => {
    expect(
      findSprite(patchDemoScreen(createDemoScreen(), WALKER_PACE), WALKER_ID)
        ?.column,
    ).toBe(1 - SPRITE_SIZE);
  });

  it('should bring the walker back to the left edge when it has crossed the whole screen', () => {
    expect(
      findSprite(
        patchDemoScreen(createDemoScreen(), TRACK_LENGTH * WALKER_PACE),
        WALKER_ID,
      )?.column,
    ).toBe(-SPRITE_SIZE);
  });

  it('should take a stride when the walk starts', () => {
    expect(
      findSprite(patchDemoScreen(createDemoScreen(), 0), WALKER_ID)?.sprite,
    ).toBe(WALKER_STRIDE);
  });

  it('should bring the feet together when one step has passed', () => {
    expect(
      findSprite(
        patchDemoScreen(createDemoScreen(), WALKER_STEP_DURATION),
        WALKER_ID,
      )?.sprite,
    ).toBe(WALKER_GATHERED);
  });

  it('should carry the lantern in the hand of the walker when the walker moves', () => {
    expect(
      findLight(
        patchDemoScreen(createDemoScreen(), WALKER_PACE * 50),
        LANTERN_ID,
      )?.column,
    ).toBe(50 - SPRITE_SIZE + LANTERN_REACH);
  });

  it('should rest the heart on its row when it is between bounces', () => {
    expect(
      findSprite(patchDemoScreen(createDemoScreen(), 0), HEART_ID)?.row,
    ).toBe(HEART_ROW);
  });

  it('should lift the heart when it is mid-bounce', () => {
    expect(
      findSprite(patchDemoScreen(createDemoScreen(), MID_BOUNCE), HEART_ID)
        ?.row,
    ).toBeLessThan(HEART_ROW);
  });

  it('should keep the glow on the heart when the heart bounces', () => {
    const screen = patchDemoScreen(createDemoScreen(), MID_BOUNCE);

    expect(findLight(screen, GLOW_ID)?.row).toBe(
      (findSprite(screen, HEART_ID)?.row ?? 0) + GLOW_OFFSET,
    );
  });

  it('should drift the cloud one pixel left when one cloud pace has passed', () => {
    expect(
      findSprite(patchDemoScreen(createDemoScreen(), CLOUD_PACE), CLOUD_ID)
        ?.column,
    ).toBe(SCREEN_WIDTH - 1);
  });

  it('should start in the dark of night when no time has passed', () => {
    expect(patchDemoScreen(createDemoScreen(), 0).ambient).toBe(-NIGHT_DEPTH);
  });

  it('should reach full daylight when half a day has passed', () => {
    expect(
      patchDemoScreen(createDemoScreen(), DAY_LENGTH / 2).ambient,
    ).toBeCloseTo(0);
  });

  it('should burn the lantern at full strength when it is the dead of night', () => {
    expect(
      findLight(patchDemoScreen(createDemoScreen(), 0), LANTERN_ID)?.intensity,
    ).toBe(LANTERN_GLOW);
  });

  it('should put the lantern and the glow out when it is full daylight', () => {
    const screen = patchDemoScreen(createDemoScreen(), DAY_LENGTH / 2);

    expect(findLight(screen, LANTERN_ID)?.intensity).toBeCloseTo(0);
    expect(findLight(screen, GLOW_ID)?.intensity).toBeCloseTo(0);
  });

  it('should not change the old screen when it moves the scene on', () => {
    const screen = createDemoScreen();

    patchDemoScreen(screen, WALKER_PACE * 10);

    expect(screen).toEqual(createDemoScreen());
  });
});
