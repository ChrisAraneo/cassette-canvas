import type { HudListItem } from '../../types/hud-list-item';

/**
 * What a press on a list landed on: each part of its scroll bar, and the
 * item under the pointer when it landed on one.
 */
export interface HudListPress {
  readonly up: boolean;
  readonly down: boolean;
  readonly thumb: boolean;
  readonly item: HudListItem | undefined;
}
