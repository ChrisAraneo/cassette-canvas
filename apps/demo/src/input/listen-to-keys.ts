import type { HudKeyEvent } from '@cassette-canvas/engine';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { toKeyEvent } from './internal/to-key-event';
import type { InputMailbox } from './types/input-mailbox';

const { nonNullable } = P;

const postKey = (mailbox: InputMailbox, event: HudKeyEvent | undefined): void =>
  match(event)
    .with(nonNullable, (key) => mailbox.post(key))
    .otherwise(noop);

/**
 * Posts the keys that go down anywhere on the page to the mailbox, so the
 * focused field reads them wherever the pointer is. Keys a HUD does not read
 * are left to the browser. The listener stays for as long as the page lives.
 */
export const listenToKeys = (target: Document, mailbox: InputMailbox): void =>
  target.addEventListener('keydown', (event) =>
    postKey(mailbox, toKeyEvent(event)),
  );
