import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { drawHudButton } from './draw-hud-button';
import { drawHudDivider } from './draw-hud-divider';
import { drawHudInput } from './draw-hud-input';
import { drawHudLabel } from './draw-hud-label';
import { drawHudList } from './draw-hud-list';
import { drawHudPanel } from './draw-hud-panel';
import { drawHudTabs } from './draw-hud-tabs';
import { drawHudWidget } from './draw-hud-widget';

const LABEL: HudWidget = Object.freeze({
  kind: 'LABEL',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS',
});

const BUTTON: HudWidget = Object.freeze({
  kind: 'BUTTON',
  id: 'skip',
  page: '',
  row: 14,
  column: 0,
  width: 40,
  text: 'SKIP',
});

const INPUT: HudWidget = Object.freeze({
  kind: 'INPUT',
  id: 'note',
  page: '',
  row: 28,
  column: 0,
  width: 60,
  text: 'HI',
});

const TABS: HudWidget = Object.freeze({
  kind: 'TABS',
  id: 'tabs',
  page: '',
  row: 42,
  column: 0,
  tabs: [{ id: 'scene', text: 'SCENE' }],
});

const PANEL: HudWidget = Object.freeze({
  kind: 'PANEL',
  id: 'meters',
  page: '',
  row: 56,
  column: 0,
  width: 60,
  height: 20,
});

const DIVIDER: HudWidget = Object.freeze({
  kind: 'DIVIDER',
  id: 'line',
  page: '',
  row: 80,
  column: 0,
  width: 60,
});

const LIST: HudWidget = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 88,
  column: 0,
  width: 80,
  height: 48,
  items: [
    { id: 'a', lines: ['SIDE A'], height: 0, widgets: [], selectable: true },
  ],
  scroll: 0,
  selected: '',
});

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: 'scene',
  widgets: [LABEL, BUTTON, INPUT, TABS, PANEL, DIVIDER, LIST],
});

describe('drawHudWidget', () => {
  it('should return the label paint steps when the widget is a label', () => {
    expect(drawHudWidget(createHud(), WINDOW, LABEL)).toEqual(
      drawHudLabel(createHud(), WINDOW, {
        kind: 'LABEL',
        id: 'fps',
        page: '',
        row: 0,
        column: 0,
        text: 'FPS',
      }),
    );
  });

  it('should return the button paint steps when the widget is a button', () => {
    expect(drawHudWidget(createHud(), WINDOW, BUTTON)).toEqual(
      drawHudButton(createHud(), WINDOW, {
        kind: 'BUTTON',
        id: 'skip',
        page: '',
        row: 14,
        column: 0,
        width: 40,
        text: 'SKIP',
      }),
    );
  });

  it('should return the field paint steps when the widget is a field', () => {
    expect(drawHudWidget(createHud(), WINDOW, INPUT)).toEqual(
      drawHudInput(createHud(), WINDOW, {
        kind: 'INPUT',
        id: 'note',
        page: '',
        row: 28,
        column: 0,
        width: 60,
        text: 'HI',
      }),
    );
  });

  it('should return the panel paint steps when the widget is a panel', () => {
    expect(drawHudWidget(createHud(), WINDOW, PANEL)).toEqual(
      drawHudPanel(createHud(), WINDOW, {
        kind: 'PANEL',
        id: 'meters',
        page: '',
        row: 56,
        column: 0,
        width: 60,
        height: 20,
      }),
    );
  });

  it('should return the divider paint steps when the widget is a divider', () => {
    expect(drawHudWidget(createHud(), WINDOW, DIVIDER)).toEqual(
      drawHudDivider(createHud(), WINDOW, {
        kind: 'DIVIDER',
        id: 'line',
        page: '',
        row: 80,
        column: 0,
        width: 60,
      }),
    );
  });

  it('should return the list paint steps when the widget is a list', () => {
    expect(drawHudWidget(createHud(), WINDOW, LIST)).toEqual(
      drawHudList(createHud(), WINDOW, {
        kind: 'LIST',
        id: 'tracks',
        page: '',
        row: 88,
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
      }),
    );
  });

  it('should return the tab strip paint steps when the widget is a tab strip', () => {
    expect(drawHudWidget(createHud(), WINDOW, TABS)).toEqual(
      drawHudTabs(createHud(), WINDOW, {
        kind: 'TABS',
        id: 'tabs',
        page: '',
        row: 42,
        column: 0,
        tabs: [{ id: 'scene', text: 'SCENE' }],
      }),
    );
  });
});
