import { last } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { HUD_DIVIDER_HEIGHT, HUD_PADDING } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudListPlacement } from './types/hud-list-placement';

const { nonNullable } = P;

export const computeItemRow = (
  placed: readonly HudListPlacement[],
  rect: HudRect,
): number =>
  match(last(placed))
    .with(
      nonNullable,
      (previous) =>
        previous.rect.row + previous.rect.height + HUD_DIVIDER_HEIGHT,
    )
    .otherwise(() => rect.row + HUD_PADDING);
