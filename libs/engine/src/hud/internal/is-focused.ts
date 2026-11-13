import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';

/** Returns `true` when a field in a window has the focus. */
export const isFocused = (hud: Hud, window: string, widget: string): boolean =>
  match(hud.focus)
    .with({ window, widget }, () => true)
    .otherwise(() => false);
