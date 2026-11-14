import type { HudWidget } from '../../types/hud-widget';

/**
 * A widget a window shows, and the item of a list it sits on, which is empty
 * for a widget of the window itself. A widget on an item is already moved to
 * where it sits in the window, so it is placed like any other one.
 */
export interface HudPlacedWidget {
  readonly widget: HudWidget;
  readonly item: string;
}
