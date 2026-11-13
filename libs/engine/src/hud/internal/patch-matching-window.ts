import { match } from 'ts-pattern';
import type { HudWindow } from '../types/hud-window';
import type { HudWindowChanges } from '../types/hud-window-changes';

export const patchMatchingWindow = (
  window: HudWindow,
  id: string,
  changes: HudWindowChanges,
): HudWindow =>
  match(window.id === id)
    .with(true, () => ({
      id,
      title: changes.title ?? window.title,
      row: changes.row ?? window.row,
      column: changes.column ?? window.column,
      width: changes.width ?? window.width,
      height: changes.height ?? window.height,
      color: changes.color ?? window.color,
      closable: changes.closable ?? window.closable,
      page: changes.page ?? window.page,
      widgets: changes.widgets ?? window.widgets,
    }))
    .otherwise(() => window);
