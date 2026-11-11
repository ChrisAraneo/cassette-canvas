import { flatMap } from 'lodash-es';
import type { Screen } from '../../screen/types/screen';
import { computeSpritePixels } from './compute-sprite-pixels';
import type { FramePixels } from './types/frame-pixels';

export const computeFramePixels = ({
  screen,
  spriteSize,
  width,
  height,
}: {
  screen: Screen;
  spriteSize: number;
  width: number;
  height: number;
}): FramePixels => ({
  background: screen.background,
  ambient: screen.ambient,
  lights: screen.lights,
  width,
  height,
  pixels: flatMap(screen.sprites, (placement) =>
    computeSpritePixels(placement, spriteSize),
  ),
});
