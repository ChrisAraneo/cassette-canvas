import { filterOtherSprites } from './internal/filter-other-sprites';
import type { Screen } from './types/screen';
import type { Sprite } from './types/sprite';

/**
 * Adds a sprite on top of the other sprites. `row` and `column` set its
 * top-left pixel. If a sprite with the same id exists, it is removed first.
 * The new sprite does not cast a shadow; to change that, call
 * `patchSprite(screen, id, { castsShadow: true })`. Returns a new screen.
 */
export const addSprite = (
  screen: Screen,
  id: string,
  sprite: Sprite,
  row: number,
  column: number,
): Screen => ({
  ...screen,
  sprites: [
    ...filterOtherSprites(screen.sprites, id),
    { id, sprite, row, column, castsShadow: false },
  ],
});
