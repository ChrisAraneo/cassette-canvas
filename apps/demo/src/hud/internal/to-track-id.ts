import { replace, startsWith } from 'lodash-es';
import { match } from 'ts-pattern';
import { PLAY_BUTTON } from '../consts';

/** What the id of every play button starts with. */
const PLAY_PREFIX = `${PLAY_BUTTON}-`;

/**
 * Returns the track a play button belongs to: the id of the button without
 * the prefix every one of them carries. A widget that is not a play button
 * belongs to no track, which is an empty id.
 */
export const toTrackId = (widget: string): string =>
  match(startsWith(widget, PLAY_PREFIX))
    .with(true, () => replace(widget, PLAY_PREFIX, ''))
    .otherwise(() => '');
