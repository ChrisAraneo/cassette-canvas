import {
  COLOR_COUNT,
  findLight,
  findSprite,
  SHADE_COUNT,
} from '@cassette-canvas/engine';
import { last, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  DAY_SKY,
  DEMO_LIGHTS,
  DEMO_SCENERY,
  LANTERN_ID,
  SCREEN_WIDTH,
  SPRITE_SIZE,
  WALKER_ID,
} from './consts';
import { createDemoScreen } from './create-demo-screen';

describe('createDemoScreen', () => {
  it('should place the color chart, the ground and the scenery when it sets the scene', () => {
    expect(size(createDemoScreen().sprites)).toBe(
      COLOR_COUNT * SHADE_COUNT +
        SCREEN_WIDTH / SPRITE_SIZE +
        size(DEMO_SCENERY),
    );
  });

  it('should paint the day sky behind everything when it sets the scene', () => {
    expect(createDemoScreen().background).toBe(DAY_SKY);
  });

  it('should draw the walker on top of everything when it sets the scene', () => {
    expect(last(createDemoScreen().sprites)?.id).toBe(WALKER_ID);
  });

  it('should start the walker off the left edge when it sets the scene', () => {
    expect(findSprite(createDemoScreen(), WALKER_ID)?.column).toBe(
      -SPRITE_SIZE,
    );
  });

  it('should make the pillars cast shadows when it sets the scene', () => {
    expect(
      findSprite(createDemoScreen(), 'pillar-left-base')?.castsShadow,
    ).toBe(true);
  });

  it('should let the light through the color chart when it sets the scene', () => {
    expect(findSprite(createDemoScreen(), 'swatch-0-0')?.castsShadow).toBe(
      false,
    );
  });

  it('should light the lantern and the glowing heart when it sets the scene', () => {
    expect(map(createDemoScreen().lights, (light) => light.id)).toEqual(
      map(DEMO_LIGHTS, (light) => light.id),
    );
  });

  it('should put the lantern where its settings say when it sets the scene', () => {
    expect(findLight(createDemoScreen(), LANTERN_ID)).toEqual(DEMO_LIGHTS[0]);
  });
});
