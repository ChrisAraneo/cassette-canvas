import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { filterPageWidgets } from './filter-page-widgets';

const ALWAYS: HudWidget = Object.freeze({
  kind: 'LABEL',
  id: 'always',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS',
});

const SCENE: HudWidget = Object.freeze({
  kind: 'LABEL',
  id: 'scene',
  page: 'scene',
  row: 8,
  column: 0,
  text: 'DAY',
});

const LAMPS: HudWidget = Object.freeze({
  kind: 'LABEL',
  id: 'light',
  page: 'light',
  row: 8,
  column: 0,
  text: 'LAMPS',
});

const WIDGETS: readonly HudWidget[] = Object.freeze([ALWAYS, SCENE, LAMPS]);

const NO_WIDGETS: readonly HudWidget[] = Object.freeze([]);

const createWindow = (
  page: string,
  widgets: readonly HudWidget[],
): HudWindow => ({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page,
  widgets,
});

describe('filterPageWidgets', () => {
  it('should return the widgets of the open page when a page is open', () => {
    expect(
      map(
        filterPageWidgets(createWindow('scene', WIDGETS)),
        (widget) => widget.id,
      ),
    ).toEqual(['always', 'scene']);
  });

  it('should return a widget with no page when any page is open', () => {
    expect(
      map(
        filterPageWidgets(createWindow('light', WIDGETS)),
        (widget) => widget.id,
      ),
    ).toEqual(['always', 'light']);
  });

  it('should return only the widgets with no page when no page is open', () => {
    expect(
      map(filterPageWidgets(createWindow('', WIDGETS)), (widget) => widget.id),
    ).toEqual(['always']);
  });

  it('should return no widgets when the window holds none', () => {
    expect(filterPageWidgets(createWindow('scene', NO_WIDGETS))).toEqual([]);
  });

  it('should return no widgets when every widget belongs to another page', () => {
    expect(filterPageWidgets(createWindow('scene', [LAMPS]))).toEqual([]);
  });
});
