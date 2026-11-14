import { describe, expect, it } from 'vitest';

import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { patchWindowWidgets } from './patch-window-widgets';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  { kind: 'label', id: 'fps', page: '', row: 0, column: 0, text: 'FPS 60' },
  { kind: 'label', id: 'clock', page: '', row: 8, column: 0, text: '12:00' },
]);

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: WIDGETS,
});

describe('patchWindowWidgets', () => {
  it('should return the widget changed when it carries the id', () => {
    expect(
      patchWindowWidgets(WINDOW, 'street', 'fps', { text: 'FPS 30' })
        .widgets[0],
    ).toMatchObject({ id: 'fps', text: 'FPS 30' });
  });

  it('should return the other widgets unchanged when it changes one', () => {
    expect(
      patchWindowWidgets(WINDOW, 'street', 'fps', { text: 'FPS 30' })
        .widgets[1],
    ).toBe(WIDGETS[1]);
  });

  it('should return the very same window when the window id does not match', () => {
    expect(patchWindowWidgets(WINDOW, 'notes', 'fps', { text: 'X' })).toBe(
      WINDOW,
    );
  });

  it('should return the same widgets when no widget has the id', () => {
    expect(
      patchWindowWidgets(WINDOW, 'street', 'ghost', { text: 'X' }).widgets,
    ).toEqual(WIDGETS);
  });
});
