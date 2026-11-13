import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';

/**
 * Whether the pointer is holding a button in a window, so it should look
 * pressed in.
 */
export const isHeld = (hud: Hud, window: string, widget: string): boolean =>
  match(hud.grab)
    .with({ kind: 'press', window, widget }, () => true)
    .otherwise(() => false);
