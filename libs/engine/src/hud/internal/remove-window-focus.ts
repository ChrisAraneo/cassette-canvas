import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudFocus } from '../types/hud-focus';

export const removeWindowFocus = (
  hud: Hud,
  window: string,
): HudFocus | undefined =>
  match(hud.focus)
    .with({ window }, constant(undefined))
    .otherwise(() => hud.focus);
