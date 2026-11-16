import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudButton } from '../types/hud-button';
import type { HudLabel } from '../types/hud-label';
import type { HudList } from '../types/hud-list';
import { toShownWidgets } from './to-shown-widgets';

const LABEL: HudLabel = Object.freeze({
  kind: 'LABEL',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS 60',
});

const BUTTON: HudButton = Object.freeze({
  kind: 'BUTTON',
  id: 'play',
  page: '',
  row: 1,
  column: 2,
  width: 0,
  text: 'PLAY',
});

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: Object.freeze([
    {
      id: 'track-1',
      lines: ['TRACK 1'],
      height: 0,
      widgets: [BUTTON],
      selectable: true,
    },
  ]),
  scroll: 0,
  selected: '',
});

describe('toShownWidgets', () => {
  it('should return the widget itself when the widget is not a list', () => {
    expect(toShownWidgets(LABEL)).toEqual([{ widget: LABEL, item: '' }]);
  });

  it('should return the list and the widgets on its items when the widget is a list', () => {
    expect(map(toShownWidgets(LIST), (placed) => placed.widget.id)).toEqual([
      'tracks',
      'play',
    ]);
  });

  it('should return the list alone when the list shows no items', () => {
    expect(size(toShownWidgets({ ...LIST, items: [] }))).toBe(1);
  });
});
