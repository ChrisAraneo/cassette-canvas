import type { HudTab } from './hud-tab';

/**
 * A strip of tabs in a window. `row` and `column` are its top-left pixel,
 * measured from the top-left pixel of the window's content. The open tab is
 * the window's `page`; clicking a tab opens its page and returns a `tab`
 * action. The strip itself usually has an empty `page`, so it shows on every
 * page.
 */
export interface HudTabs {
  readonly kind: 'tabs';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly tabs: readonly HudTab[];
}
