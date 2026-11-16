import { describe, expect, it } from 'vitest';

import type { HudButton } from '../types/hud-button';
import type { HudDivider } from '../types/hud-divider';
import type { HudInput } from '../types/hud-input';
import type { HudLabel } from '../types/hud-label';
import type { HudList } from '../types/hud-list';
import type { HudPanel } from '../types/hud-panel';
import type { HudTabs } from '../types/hud-tabs';
import { patchWidget } from './patch-widget';

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
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 30,
  text: 'SKIP',
});

const INPUT: HudInput = Object.freeze({
  kind: 'INPUT',
  id: 'note',
  page: '',
  row: 0,
  column: 0,
  width: 60,
  text: 'HI',
});

const TABS: HudTabs = Object.freeze({
  kind: 'TABS',
  id: 'pages',
  page: '',
  row: 0,
  column: 0,
  tabs: Object.freeze([{ id: 'tracks', text: 'TRACKS' }]),
});

const PANEL: HudPanel = Object.freeze({
  kind: 'PANEL',
  id: 'frame',
  page: '',
  row: 0,
  column: 0,
  width: 40,
  height: 20,
});

const DIVIDER: HudDivider = Object.freeze({
  kind: 'DIVIDER',
  id: 'rule',
  page: '',
  row: 0,
  column: 0,
  width: 40,
});

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: Object.freeze([]),
  scroll: 0,
  selected: '',
});

describe('patchWidget', () => {
  it('should put the new text on a label when it changes one', () => {
    expect(patchWidget(LABEL, { text: 'FPS 30' })).toMatchObject({
      text: 'FPS 30',
    });
  });

  it('should put the new text and width on a button when it changes one', () => {
    expect(patchWidget(BUTTON, { text: 'STOP', width: 40 })).toMatchObject({
      text: 'STOP',
      width: 40,
    });
  });

  it('should put the new text and width on a field when it changes one', () => {
    expect(patchWidget(INPUT, { text: 'HIT', width: 70 })).toMatchObject({
      text: 'HIT',
      width: 70,
    });
  });

  it('should put the new tabs on a strip when it changes one', () => {
    expect(
      patchWidget(TABS, { tabs: [{ id: 'about', text: 'ABOUT' }] }),
    ).toMatchObject({ tabs: [{ id: 'about', text: 'ABOUT' }] });
  });

  it('should put the new size on a panel when it changes one', () => {
    expect(patchWidget(PANEL, { width: 50, height: 25 })).toMatchObject({
      width: 50,
      height: 25,
    });
  });

  it('should put the new width on a divider when it changes one', () => {
    expect(patchWidget(DIVIDER, { width: 50 })).toMatchObject({ width: 50 });
  });

  it('should put the new size, items, scroll and selection on a list when it changes one', () => {
    expect(
      patchWidget(LIST, {
        width: 90,
        height: 60,
        items: [
          {
            id: 'a',
            lines: ['A'],
            height: 0,
            widgets: [],
            selectable: true,
          },
        ],
        scroll: 1,
        selected: 'a',
      }),
    ).toMatchObject({ width: 90, height: 60, scroll: 1, selected: 'a' });
  });

  it('should leave the widget as it is when the changes name nothing', () => {
    expect(patchWidget(BUTTON, {})).toEqual(BUTTON);
  });

  it('should not change the old widget when it changes one', () => {
    expect(patchWidget(BUTTON, { text: 'STOP' })).not.toBe(BUTTON);
    expect(BUTTON.text).toBe('SKIP');
  });
});
