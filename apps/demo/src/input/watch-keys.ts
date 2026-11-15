import { runEffect } from '@cassette-canvas/common';
import type { HudKeyEvent } from '@cassette-canvas/engine';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { addInputEvent } from './add-input-event';
import { toKeyEvent } from './internal/to-key-event';
import type { InputMailbox } from './types/input-mailbox';

const { nonNullable } = P;

const addKeyEvent = (
  event: HudKeyEvent | undefined,
  mailbox: InputMailbox,
): InputMailbox | undefined =>
  match(event)
    .with(nonNullable, (key) => addInputEvent(key, mailbox))
    .otherwise(constant(undefined));

/**
 * Adds the keys that go down anywhere on the page to the mailbox, so the
 * focused field reads them wherever the pointer is. Keys a HUD does not read
 * are left to the browser. The watcher stays for as long as the page lives.
 */
export const watchKeys = (target: Document, mailbox: InputMailbox): Document =>
  runEffect(target, (watched) =>
    watched.addEventListener('keydown', (event) =>
      addKeyEvent(toKeyEvent(event), mailbox),
    ),
  );
