import type { HudWindow } from './hud-window';

/** The window fields to change. Fields you leave out keep their values. */
export type HudWindowChanges = Partial<
  Pick<
    HudWindow,
    | 'title'
    | 'row'
    | 'column'
    | 'width'
    | 'height'
    | 'color'
    | 'closable'
    | 'page'
    | 'widgets'
  >
>;
