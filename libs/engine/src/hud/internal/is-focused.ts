import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';

/** Whether a field in a window is the one that takes the keys. */
export const isFocused = (hud: Hud, window: string, widget: string): boolean =>
  match(hud.focus)
    .with({ window, widget }, () => true)
    .otherwise(() => false);
