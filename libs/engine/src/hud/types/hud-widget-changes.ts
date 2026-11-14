import type { HudListItem } from './hud-list-item';
import type { HudTab } from './hud-tab';

/**
 * The widget fields to change: the `text` of a label, a button, or a field,
 * the `width` of a button, a field, a panel, a divider, or a list, the
 * `height` of a panel or a list, the `tabs` of a tab strip, and the `items`,
 * the `scroll`, or the `selected` item of a list. Fields you leave out, and
 * fields the widget does not have, keep their values.
 */
export type HudWidgetChanges = Partial<{
  text: string;
  width: number;
  height: number;
  tabs: readonly HudTab[];
  items: readonly HudListItem[];
  scroll: number;
  selected: string;
}>;
