import { dropRight, join, size, split } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { findHudWidget } from '../find-hud-widget';
import { patchHudWidget } from '../patch-hud-widget';
import { HUD_BACKSPACE_KEY, HUD_ENTER_KEY, HUD_ESCAPE_KEY } from '../consts';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudFocus } from '../types/hud-focus';
import type { HudInput } from '../types/hud-input';

const { nonNullable } = P;

const dropLast = (text: string): string =>
  join(dropRight(split(text, ''), 1), '');

const isCharacter = (key: string): boolean => size(key) === 1;

const toTypedChange = (hud: Hud, focus: HudFocus, text: string): HudChange => ({
  hud: patchHudWidget(hud, focus.window, focus.widget, { text }),
  actions: [
    { kind: 'type', window: focus.window, widget: focus.widget, value: text },
  ],
});

const applyKey = (
  hud: Hud,
  focus: HudFocus,
  input: HudInput,
  key: string,
): HudChange =>
  match(key)
    .with(HUD_BACKSPACE_KEY, () =>
      toTypedChange(hud, focus, dropLast(input.text)),
    )
    .with(HUD_ENTER_KEY, (): HudChange => ({
      hud,
      actions: [
        {
          kind: 'submit',
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

/**
 * Handles a key that went down. Only the focused field reads it: it types
 * one character into the field, Backspace takes one off, Enter returns a
 * `submit`, and Escape clears the focus. Every other key is ignored.
 */
export const typeHud = (hud: Hud, key: string): HudChange =>
  match(hud.focus)
    .with(nonNullable, (focus) =>
      match(findHudWidget(hud, focus.window, focus.widget))
        .with({ kind: 'input' }, (input) => applyKey(hud, focus, input, key))
        .otherwise((): HudChange => ({ hud, actions: [] })),
    )
    .otherwise((): HudChange => ({ hud, actions: [] }));
