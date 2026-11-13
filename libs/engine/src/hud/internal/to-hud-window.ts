import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import type { HudWindowSettings } from '../types/hud-window-settings';
import { computeFirstPage } from './compute-first-page';

const NO_WIDGETS: readonly HudWidget[] = Object.freeze([]);

/** Fills in what the settings leave out. */
export const toHudWindow = (
  hud: Hud,
  settings: HudWindowSettings,
): HudWindow => ({
  id: settings.id,
  title: settings.title,
  row: settings.row,
  column: settings.column,
  width: settings.width,
  height: settings.height,
  color: settings.color ?? hud.theme.color,
  closable: settings.closable ?? true,
  page: settings.page ?? computeFirstPage(settings.widgets ?? NO_WIDGETS),
  widgets: settings.widgets ?? NO_WIDGETS,
});
