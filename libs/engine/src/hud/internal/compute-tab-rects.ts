import { reduce } from 'lodash-es';
import { HUD_CONTENT_LEFT, HUD_CONTENT_TOP } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import type { HudTabs } from '../types/hud-tabs';
import { addTabRect } from './add-tab-rect';

const START: readonly HudRect[] = Object.freeze([]);

/**
 * Returns where each tab of a strip sits, measured from the window's
 * top-left pixel. Tabs sit side by side, each as wide as its own text.
 */
export const computeTabRects = (widget: HudTabs): readonly HudRect[] =>
  reduce(
    widget.tabs,
    (rects: readonly HudRect[], tab: HudTab) =>
      addTabRect(
        rects,
        tab,
        HUD_CONTENT_TOP + widget.row,
        HUD_CONTENT_LEFT + widget.column,
      ),
    START,
  );
