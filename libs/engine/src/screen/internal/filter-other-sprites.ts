import { filter } from 'lodash-es';
import type { SpritePlacement } from '../types/sprite-placement';

export const filterOtherSprites = (
  sprites: readonly SpritePlacement[],
  id: string,
): SpritePlacement[] => filter(sprites, (placement) => placement.id !== id);
