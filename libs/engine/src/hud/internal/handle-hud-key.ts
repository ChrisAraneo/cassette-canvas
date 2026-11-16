import { match, P } from 'ts-pattern';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import { handleFieldKey } from './handle-field-key';

const { nonNullable } = P;

/**
 * Handles a key that went down. Only the focused field reads it: it types
 * one character into the field, Backspace takes one off, Enter returns a
 * `SUBMIT`, and Escape clears the focus. Every other key is ignored.
 */
export const handleHudKey = (hud: Hud, key: string): HudChange =>
  match(hud.focus)
    .with(nonNullable, (focus) =>
      match(findHudWidget(hud, focus.window, focus.widget))
        .with({ kind: 'INPUT' }, (input) =>
          handleFieldKey(hud, focus, input, key),
        )
        .otherwise((): HudChange => ({ hud, actions: [] })),
    )
    .otherwise((): HudChange => ({ hud, actions: [] }));
