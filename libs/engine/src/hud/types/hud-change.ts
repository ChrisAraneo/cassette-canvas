import type { Hud } from './hud';
import type { HudAction } from './hud-action';

/**
 * What an event did: the HUD as it now is, and what the person did to it.
 * `actions` is empty when nothing came of the event.
 */
export interface HudChange {
  readonly hud: Hud;
  readonly actions: readonly HudAction[];
}
