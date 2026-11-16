import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudTheme } from '../types/hud-theme';
import { drawBevel } from './draw-bevel';
import type { HudListLayout } from './types/hud-list-layout';

export const drawThumb = (
  layout: HudListLayout,
  theme: HudTheme,
  held: boolean,
): readonly OverlayPaint[] =>
  match(held)
    .with(true, () =>
      drawBevel(
        layout.thumb,
        toPixel(theme.color, theme.shadow),
        toPixel(theme.color, theme.highlight),
      ),
    )
    .otherwise(() =>
      drawBevel(
        layout.thumb,
        toPixel(theme.color, theme.highlight),
        toPixel(theme.color, theme.shadow),
      ),
    );
