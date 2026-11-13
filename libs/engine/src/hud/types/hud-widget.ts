import type { HudButton } from './hud-button';
import type { HudInput } from './hud-input';
import type { HudLabel } from './hud-label';
import type { HudTabs } from './hud-tabs';

/** Everything a window can hold. */
export type HudWidget = HudButton | HudInput | HudLabel | HudTabs;
