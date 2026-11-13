import type { HudKeyEvent } from './hud-key-event';
import type { HudPointerEvent } from './hud-pointer-event';

/** Something the person did that a HUD can answer. */
export type HudEvent = HudKeyEvent | HudPointerEvent;
