import { filter } from 'lodash-es';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';

/**
 * The widgets a window shows right now: the ones on its open page, and the
 * ones with an empty page, which show whatever page is open.
 */
export const filterPageWidgets = (window: HudWindow): HudWidget[] =>
  filter(
    window.widgets,
    (widget) => widget.page === '' || widget.page === window.page,
  );
