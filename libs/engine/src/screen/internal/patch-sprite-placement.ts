import { match } from 'ts-pattern';
import type { SpriteChanges } from '../types/sprite-changes';
import type { SpritePlacement } from '../types/sprite-placement';

export const patchSpritePlacement = (
  placement: SpritePlacement,
  id: string,
  changes: SpriteChanges,
): SpritePlacement =>
  match(placement.id === id)
    .with(true, () => ({
      id,
      sprite: changes.sprite ?? placement.sprite,
      row: changes.row ?? placement.row,
      column: changes.column ?? placement.column,
      castsShadow: changes.castsShadow ?? placement.castsShadow,
    }))
    .otherwise(() => placement);
