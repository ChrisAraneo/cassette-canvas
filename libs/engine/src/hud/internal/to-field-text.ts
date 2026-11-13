import { drop, isEmpty, join, split } from 'lodash-es';
import { match } from 'ts-pattern';
import { measureText } from '../../text/measure-text';

/**
 * The end of a text that fits in `room` pixels. A field shows the end of
 * what was typed, so the caret stays in sight, and drops characters off the
 * front until the rest fits.
 */
export const toFieldText = (text: string, room: number): string =>
  match(isEmpty(text) || measureText(text) <= room)
    .with(true, () => text)
    .otherwise(() => toFieldText(join(drop(split(text, ''), 1), ''), room));
