import { map } from 'lodash-es';
import { patchSpritePlacement } from './internal/patch-sprite-placement';
import type { Screen } from './types/screen';
import type { SpriteChanges } from './types/sprite-changes';

/**
 * Changes a sprite's `sprite` (for animation), `row`, `column` or
 * `castsShadow`. Fields you leave out keep their values. The sprite keeps its
 * place in the drawing order. Returns a new screen. If no sprite has the id,
 * nothing changes.
 */
export const patchSprite = (
  screen: Screen,
  id: string,
  changes: SpriteChanges,
): Screen => ({
  ...screen,
  sprites: map(screen.sprites, (placement) =>
    patchSpritePlacement(placement, id, changes),
  ),
});
