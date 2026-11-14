import { dropRight, isEmpty, join, split } from 'lodash-es';
import { match } from 'ts-pattern';
import { measureText } from '../../text/measure-text';

/**
 * Returns the start of a text that fits in `room` pixels. An item of a list
 * shows as much of its text as the list is wide, and drops characters off
 * the end until the rest fits.
 */
export const toListText = (text: string, room: number): string =>
  match(isEmpty(text) || measureText(text) <= room)
    .with(true, () => text)
    .otherwise(() => toListText(join(dropRight(split(text, ''), 1), ''), room));
