import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudGrab } from '../types/hud-grab';

export const removeWindowGrab = (
  hud: Hud,
  window: string,
): HudGrab | undefined =>
  match(hud.grab)
    .with({ window }, constant(undefined))
    .otherwise(() => hud.grab);
