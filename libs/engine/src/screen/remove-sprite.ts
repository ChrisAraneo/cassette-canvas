import { filterOtherSprites } from './internal/filter-other-sprites';
import type { Screen } from './types/screen';

/** Removes the sprite with the id. Returns a new screen. */
export const removeSprite = (screen: Screen, id: string): Screen => ({
  ...screen,
  sprites: filterOtherSprites(screen.sprites, id),
});
