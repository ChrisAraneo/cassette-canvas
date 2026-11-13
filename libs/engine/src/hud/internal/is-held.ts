import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';

/**
 * Returns `true` when the pointer is holding a button in a window, so it is
 * drawn pressed in.
 */
export const isHeld = (hud: Hud, window: string, widget: string): boolean =>
  match(hud.grab)
    .with({ kind: 'press', window, widget }, () => true)
    .otherwise(() => false);
