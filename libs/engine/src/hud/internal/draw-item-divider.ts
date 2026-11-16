import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_DIVIDER_HEIGHT } from '../consts';
import type { HudTheme } from '../types/hud-theme';
import { drawGroove } from './draw-groove';
import type { HudListPlacement } from './types/hud-list-placement';

const NO_PAINTS: readonly OverlayPaint[] = Object.freeze([]);

export const drawItemDivider = (
  placement: HudListPlacement,
  index: number,
  count: number,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  match(index < count - 1)
    .with(true, () =>
      drawGroove(
        {
          ...placement.rect,
          row: placement.rect.row + placement.rect.height,
          height: HUD_DIVIDER_HEIGHT,
        },
        toPixel(theme.color, theme.highlight),
        toPixel(theme.color, theme.shadow),
      ),
    )
    .otherwise(() => NO_PAINTS);
