import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';

export const isClosing = (hud: Hud, window: HudWindow): boolean =>
  match(hud.grab)
    .with({ kind: 'CLOSE', window: window.id }, () => true)
    .otherwise(() => false);
