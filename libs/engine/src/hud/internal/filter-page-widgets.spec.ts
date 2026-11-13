import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { filterPageWidgets } from './filter-page-widgets';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  { kind: 'label', id: 'always', page: '', row: 0, column: 0, text: 'FPS' },
  { kind: 'label', id: 'scene', page: 'scene', row: 8, column: 0, text: 'DAY' },
  {
    kind: 'label',
    id: 'light',
    page: 'light',
    row: 8,
    column: 0,
    text: 'LAMPS',
  },
]);

const createWindow = (page: string): HudWindow => ({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page,
  widgets: WIDGETS,
});

describe('filterPageWidgets', () => {
  it('should keep the widgets of the open page', () => {
    expect(
      map(filterPageWidgets(createWindow('scene')), (widget) => widget.id),
    ).toEqual(['always', 'scene']);
  });

  it('should keep a widget with no page whatever page is open', () => {
    expect(
      map(filterPageWidgets(createWindow('light')), (widget) => widget.id),
    ).toEqual(['always', 'light']);
  });

  it('should keep only the widgets with no page when no page is open', () => {
    expect(
      map(filterPageWidgets(createWindow('')), (widget) => widget.id),
    ).toEqual(['always']);
  });
});
