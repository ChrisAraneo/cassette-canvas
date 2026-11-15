import { drop, isEmpty, join, split } from 'lodash-es';
import { match } from 'ts-pattern';
import { computeTextAdvance } from '../../text/compute-text-advance';

/**
 * Returns the end of a text that fits in `room` pixels. A field shows the
 * end of what was typed, so the caret stays visible, and drops characters
 * off the front until the rest fits.
 */
export const sliceFieldText = (text: string, room: number): string =>
  match(isEmpty(text) || computeTextAdvance(text) <= room)
    .with(true, () => text)
    .otherwise(() => sliceFieldText(join(drop(split(text, ''), 1), ''), room));
