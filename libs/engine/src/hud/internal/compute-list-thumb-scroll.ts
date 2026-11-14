import { round } from 'lodash-es';
import { match } from 'ts-pattern';
import type { HudList } from '../types/hud-list';
import { computeListLayout } from './compute-list-layout';
import { computeListScroll } from './compute-list-scroll';

/**
 * Returns the scroll a list holds while the top row of the thumb on its
 * scroll bar sits at `top`, measured from the window's top-left pixel: the
 * thumb at the top of its track is the first item, and the thumb at the
 * bottom of it the last page. A list with no thumb to drag keeps the scroll
 * it has.
 */
export const computeListThumbScroll = (
  widget: HudList,
  top: number,
): number => {
  const layout = computeListLayout(widget);
  const room = layout.track.height - layout.thumb.height;

  return match(layout.thumb.height > 0 && room > 0)
    .with(true, () =>
      computeListScroll(
        widget,
        round(((top - layout.track.row) * layout.lastPage) / room),
      ),
    )
    .otherwise(() => layout.scroll);
};
