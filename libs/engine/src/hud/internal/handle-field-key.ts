import { match } from 'ts-pattern';
import { HUD_BACKSPACE_KEY, HUD_ENTER_KEY, HUD_ESCAPE_KEY } from '../consts';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudFocus } from '../types/hud-focus';
import type { HudInput } from '../types/hud-input';
import { isCharacter } from './is-character';
import { sliceWithoutLast } from './slice-without-last';
import { toTypedChange } from './to-typed-change';

export const handleFieldKey = (
  hud: Hud,
  focus: HudFocus,
  input: HudInput,
  key: string,
): HudChange =>
  match(key)
    .with(HUD_BACKSPACE_KEY, () =>
      toTypedChange(hud, focus, sliceWithoutLast(input.text)),
    )
    .with(HUD_ENTER_KEY, (): HudChange => ({
      hud,
      actions: [
        {
          kind: 'SUBMIT',
          window: focus.window,
          widget: focus.widget,
          value: input.text,
        },
      ],
    }))
    .with(HUD_ESCAPE_KEY, (): HudChange => ({
      hud: { ...hud, focus: undefined },
      actions: [],
    }))
    .when(isCharacter, (character) =>
      toTypedChange(hud, focus, input.text + character),
    )
    .otherwise((): HudChange => ({ hud, actions: [] }));
