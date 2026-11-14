import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';

/**
 * Returns `true` when the pointer is holding the thumb on the scroll bar of
 * a list in a window, so the thumb is drawn pressed in while it is dragged.
 */
export const isScrolling = (
  hud: Hud,
  window: string,
  widget: string,
): boolean =>
  match(hud.grab)
    .with({ kind: 'scroll', window, widget }, () => true)
    .otherwise(() => false);
