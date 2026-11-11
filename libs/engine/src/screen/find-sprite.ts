import { find } from 'lodash-es';
import type { Screen } from './types/screen';
import type { SpritePlacement } from './types/sprite-placement';

/** Returns the sprite with the id, or `undefined` if there is none. */
export const findSprite = (
  screen: Screen,
  id: string,
): SpritePlacement | undefined =>
  find(screen.sprites, (placement) => placement.id === id);
