import type { Hud } from './hud';
import type { HudAction } from './hud-action';

/**
 * What an event did: the HUD as it now is, and the actions it caused.
 * `actions` is empty when the event caused none.
 */
export interface HudChange {
  readonly hud: Hud;
  readonly actions: readonly HudAction[];
}
