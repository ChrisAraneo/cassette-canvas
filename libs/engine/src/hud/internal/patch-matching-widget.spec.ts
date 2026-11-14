import { describe, expect, it } from 'vitest';

import type { HudButton } from '../types/hud-button';
import type { HudDivider } from '../types/hud-divider';
import type { HudInput } from '../types/hud-input';
import type { HudLabel } from '../types/hud-label';
import type { HudList } from '../types/hud-list';
import type { HudPanel } from '../types/hud-panel';
import type { HudTabs } from '../types/hud-tabs';
import { patchMatchingWidget } from './patch-matching-widget';

const LABEL: HudLabel = Object.freeze({
  kind: 'label',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS 60',
});

const BUTTON: HudButton = Object.freeze({
  kind: 'button',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 30,
  text: 'SKIP',
});

const INPUT: HudInput = Object.freeze({
  kind: 'input',
  id: 'note',
  page: '',
  row: 0,
  column: 0,
  width: 60,
  text: 'hello',
});

const TABS: HudTabs = Object.freeze({
  kind: 'tabs',
  id: 'tabs',
  page: '',
  row: 0,
  column: 0,
  tabs: [{ id: 'scene', text: 'SCENE' }],
});

const PANEL: HudPanel = Object.freeze({
  kind: 'panel',
  id: 'meters',
  page: '',
  row: 0,
  column: 0,
  width: 60,
  height: 20,
});

const DIVIDER: HudDivider = Object.freeze({
  kind: 'divider',
  id: 'line',
  page: '',
  row: 0,
  column: 0,
  width: 60,
});

const LIST: HudList = Object.freeze({
  kind: 'list',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: [
    {
      id: 'a',
      lines: ['SIDE A'],
      height: 0,
      widgets: [],
      selectable: true,
    },
  ],
  scroll: 0,
  selected: '',
});

describe('patchMatchingWidget', () => {
  it('should return the new text when the widget is a label', () => {
    expect(patchMatchingWidget(LABEL, 'fps', { text: 'FPS 30' })).toEqual({
      ...LABEL,
      text: 'FPS 30',
    });
  });

  it('should return the new text and width when the widget is a button', () => {
    expect(
      patchMatchingWidget(BUTTON, 'skip', { text: 'HOLD', width: 40 }),
    ).toEqual({ ...BUTTON, text: 'HOLD', width: 40 });
  });

  it('should return the new text when the widget is a field', () => {
    expect(patchMatchingWidget(INPUT, 'note', { text: 'bye' })).toEqual({
      ...INPUT,
      text: 'bye',
    });
  });

  it('should return the new tabs when the widget is a strip', () => {
    expect(
      patchMatchingWidget(TABS, 'tabs', {
        tabs: [{ id: 'light', text: 'LIGHT' }],
      }),
    ).toEqual({ ...TABS, tabs: [{ id: 'light', text: 'LIGHT' }] });
  });

  it('should return the new size when the widget is a panel', () => {
    expect(
      patchMatchingWidget(PANEL, 'meters', { width: 70, height: 30 }),
    ).toEqual({ ...PANEL, width: 70, height: 30 });
  });

  it('should return the new width when the widget is a divider', () => {
    expect(patchMatchingWidget(DIVIDER, 'line', { width: 70 })).toEqual({
      ...DIVIDER,
      width: 70,
    });
  });

  it('should return the new items when the widget is a list', () => {
    expect(
      patchMatchingWidget(LIST, 'tracks', {
        items: [
          {
            id: 'b',
            lines: ['SIDE B'],
            height: 0,
            widgets: [],
            selectable: true,
          },
        ],
      }),
    ).toEqual({
      ...LIST,
      items: [
        {
          id: 'b',
          lines: ['SIDE B'],
          height: 0,
          widgets: [],
          selectable: true,
        },
      ],
    });
  });

  it('should return the new scroll and selected item when the widget is a list', () => {
    expect(
      patchMatchingWidget(LIST, 'tracks', { scroll: 2, selected: 'a' }),
    ).toEqual({ ...LIST, scroll: 2, selected: 'a' });
  });

  it('should return the same widget when the change names a field it does not have', () => {
    expect(patchMatchingWidget(LABEL, 'fps', { width: 40 })).toEqual(LABEL);
  });

  it('should return the very same widget when the id does not match', () => {
    expect(patchMatchingWidget(LABEL, 'clock', { text: 'FPS 30' })).toBe(LABEL);
  });
});
