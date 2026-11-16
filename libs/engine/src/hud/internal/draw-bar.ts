import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_DOWN_ART, HUD_UP_ART } from '../consts';
import type { HudTheme } from '../types/hud-theme';
import { drawArrow } from './draw-arrow';
import { drawThumb } from './draw-thumb';
import type { HudListLayout } from './types/hud-list-layout';

export const drawBar = (
  layout: HudListLayout,
  theme: HudTheme,
  held: boolean,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.body), ...layout.track },
  { pixel: toPixel(theme.color, theme.face), ...layout.thumb },
  ...drawThumb(layout, theme, held),
  ...drawArrow(layout.up, HUD_UP_ART, theme),
  ...drawArrow(layout.down, HUD_DOWN_ART, theme),
];
