import type { HudButton } from './hud-button';
import type { HudDivider } from './hud-divider';
import type { HudLabel } from './hud-label';
import type { HudPanel } from './hud-panel';

/**
 * What an item of a list can hold: the widgets that take no typing of their
 * own and hold no items themselves. Their `row` and `column` are measured
 * from the item's top-left pixel, and their `page` is ignored, since an item
 * shows whenever the list it sits in does.
 *
 * A button on an item works like any other button: it takes the press
 * instead of the item under it and returns a `click` action, so its id has
 * to be one of a kind in the window. A label, a divider, and a panel take no
 * press at all, so pressing one selects the item they sit on.
 */
export type HudItemWidget = HudButton | HudDivider | HudLabel | HudPanel;
