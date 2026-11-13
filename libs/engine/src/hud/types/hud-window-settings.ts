import type { HudWindow } from './hud-window';

/**
 * A window to add. `color` defaults to the HUD's color, `closable` to
 * `true`,
 * `widgets` to none, and `page` to the first tab of the first tab strip.
 */
export type HudWindowSettings = Pick<
  HudWindow,
  'id' | 'title' | 'row' | 'column' | 'width' | 'height'
> &
  Partial<Pick<HudWindow, 'color' | 'closable' | 'page' | 'widgets'>>;
