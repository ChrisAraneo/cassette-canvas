import {
  addLight,
  addSprite,
  createScreen,
  type Light,
  patchSprite,
  type Screen,
  type SpritePlacement,
} from '@cassette-canvas/engine';
import { reduce } from 'lodash-es';
import { pipe } from 'remeda';
import { DAY_SKY, DEMO_LIGHTS, DEMO_SCENERY } from './consts';
import { createGroundPlacements } from './internal/create-ground-placements';
import { createSwatchPlacements } from './internal/create-swatch-placements';

const addDemoSprite = (
  screen: Screen,
  { id, sprite, row, column, castsShadow }: SpritePlacement,
): Screen =>
  patchSprite(addSprite(screen, id, sprite, row, column), id, { castsShadow });

const addDemoLight = (screen: Screen, light: Light): Screen =>
  addLight(screen, light.id, light);

export const createDemoScreen = (): Screen =>
  pipe(
    createScreen(DAY_SKY),
    (screen) =>
      reduce(
        [
          ...createSwatchPlacements(),
          ...createGroundPlacements(),
          ...DEMO_SCENERY,
        ],
        addDemoSprite,
        screen,
      ),
    (screen) => reduce(DEMO_LIGHTS, addDemoLight, screen),
  );
