import type { HudButton } from './hud-button';
import type { HudDivider } from './hud-divider';
import type { HudInput } from './hud-input';
import type { HudLabel } from './hud-label';
import type { HudList } from './hud-list';
import type { HudPanel } from './hud-panel';
import type { HudTabs } from './hud-tabs';

/** Everything a window can hold. */
export type HudWidget =
  HudButton | HudDivider | HudInput | HudLabel | HudList | HudPanel | HudTabs;
