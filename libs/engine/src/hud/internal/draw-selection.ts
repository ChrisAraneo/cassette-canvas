import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudList } from '../types/hud-list';
import type { HudTheme } from '../types/hud-theme';
import { isSelected } from './is-selected';
import type { HudListPlacement } from './types/hud-list-placement';

const NO_PAINTS: readonly OverlayPaint[] = Object.freeze([]);

export const drawSelection = (
  placement: HudListPlacement,
  widget: HudList,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  match(isSelected(placement, widget))
    .with(true, (): readonly OverlayPaint[] => [
      { pixel: toPixel(theme.color, theme.shadow), ...placement.rect },
    ])
    .otherwise(() => NO_PAINTS);
