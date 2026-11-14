import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { paintHudButton } from './paint-hud-button';
import { paintHudInput } from './paint-hud-input';
import { paintHudLabel } from './paint-hud-label';
import { paintHudTabs } from './paint-hud-tabs';
import { paintHudWidget } from './paint-hud-widget';

const LABEL: HudWidget = Object.freeze({
  kind: 'label',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS',
});

const BUTTON: HudWidget = Object.freeze({
  kind: 'button',
  id: 'skip',
  page: '',
  row: 14,
  column: 0,
  width: 40,
  text: 'SKIP',
});

const INPUT: HudWidget = Object.freeze({
  kind: 'input',
  id: 'note',
  page: '',
  row: 28,
  column: 0,
  width: 60,
  text: 'HI',
});

const TABS: HudWidget = Object.freeze({
  kind: 'tabs',
  id: 'tabs',
  page: '',
  row: 42,
  column: 0,
  tabs: [{ id: 'scene', text: 'SCENE' }],
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
  widgets: [LABEL, BUTTON, INPUT, TABS],
});

describe('paintHudWidget', () => {
  it('should return the label paint steps when the widget is a label', () => {
    expect(paintHudWidget(createHud(), WINDOW, LABEL)).toEqual(
      paintHudLabel(createHud(), WINDOW, {
        kind: 'label',
        id: 'fps',
        page: '',
        row: 0,
        column: 0,
        text: 'FPS',
      }),
    );
  });

  it('should return the button paint steps when the widget is a button', () => {
    expect(paintHudWidget(createHud(), WINDOW, BUTTON)).toEqual(
      paintHudButton(createHud(), WINDOW, {
        kind: 'button',
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
    expect(paintHudWidget(createHud(), WINDOW, INPUT)).toEqual(
      paintHudInput(createHud(), WINDOW, {
        kind: 'input',
        id: 'note',
        page: '',
        row: 28,
        column: 0,
        width: 60,
        text: 'HI',
      }),
    );
  });

  it('should return the tab strip paint steps when the widget is a tab strip', () => {
    expect(paintHudWidget(createHud(), WINDOW, TABS)).toEqual(
      paintHudTabs(createHud(), WINDOW, {
        kind: 'tabs',
        id: 'tabs',
        page: '',
        row: 42,
        column: 0,
        tabs: [{ id: 'scene', text: 'SCENE' }],
      }),
    );
  });
});
