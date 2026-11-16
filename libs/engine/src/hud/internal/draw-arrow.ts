import { floor, size } from 'lodash-es';
import { toOverlay } from '../../overlay/to-overlay';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { TEXT_INK } from '../../text/consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { drawBevel } from './draw-bevel';
import { toArtWidth } from './to-art-width';

export const drawArrow = (
  rect: HudRect,
  art: readonly string[],
  theme: HudTheme,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.face), ...rect },
  ...drawBevel(
    rect,
    toPixel(theme.color, theme.highlight),
    toPixel(theme.color, theme.shadow),
  ),
  {
    image: toOverlay(art, { [TEXT_INK]: toPixel(theme.color, theme.text) }),
    row: rect.row + floor((rect.height - size(art)) / 2),
    column: rect.column + floor((rect.width - toArtWidth(art)) / 2),
  },
];
