import type { HudTab } from './hud-tab';

/**
 * The widget fields to change: the `text` of a label, a button, or a field,
 * the `width` of a button or a field, and the `tabs` of a tab strip. Fields
 * you leave out, and fields the widget does not have, keep their values.
 */
export type HudWidgetChanges = Partial<{
  text: string;
  width: number;
  tabs: readonly HudTab[];
}>;
