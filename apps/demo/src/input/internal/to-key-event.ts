import {
  HUD_BACKSPACE_KEY,
  HUD_ENTER_KEY,
  HUD_ESCAPE_KEY,
  type HudKeyEvent,
} from '@cassette-canvas/engine';
import { includes, size } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

const NAMED_KEYS: readonly string[] = Object.freeze([
  HUD_BACKSPACE_KEY,
  HUD_ENTER_KEY,
  HUD_ESCAPE_KEY,
]);

/**
 * Returns `true` for one character to type, or for a key a HUD handles by
 * name.
 */
const isHudKey = (key: string): boolean =>
  size(key) === 1 || includes(NAMED_KEYS, key);

/**
 * Turns a key that went down into a HUD event, or returns `undefined` for
 * the keys a HUD does not read: a shortcut with a modifier held, and keys
 * such as the arrows or F1.
 */
export const toKeyEvent = ({
  key,
  ctrlKey,
  altKey,
  metaKey,
}: KeyboardEvent): HudKeyEvent | undefined =>
  match({ key, ctrlKey, altKey, metaKey })
    .with(
      {
        key: when(isHudKey),
        ctrlKey: false,
        altKey: false,
        metaKey: false,
      },
      (pressed): HudKeyEvent => ({ kind: 'key', key: pressed.key }),
    )
    .otherwise(() => undefined);
