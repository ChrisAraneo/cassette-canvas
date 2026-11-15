import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { findHudWidget } from './find-hud-widget';
import { findHudWindow } from './find-hud-window';
import { handleHud } from './handle-hud';
import type { Hud } from './types/hud';
import type { HudItemWidget } from './types/hud-item-widget';
import type { HudList } from './types/hud-list';
import type { HudWidget } from './types/hud-widget';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'BUTTON',
    id: 'skip',
    page: '',
    row: 0,
    column: 0,
    width: 30,
    text: 'SKIP',
  },
  {
    kind: 'INPUT',
    id: 'note',
    page: '',
    row: 16,
    column: 0,
    width: 60,
    text: '',
  },
]);

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
    widgets: WIDGETS,
  });

const PLAY: HudItemWidget = Object.freeze({
  kind: 'BUTTON',
  id: 'play-a',
  page: '',
  row: 0,
  column: 40,
  width: 20,
  text: 'PLAY',
});

const TRACKS: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 36,
  items: [
    {
      id: 'a',
      lines: ['SIDE A'],
      height: 0,
      widgets: [PLAY],
      selectable: true,
    },
    { id: 'b', lines: ['SIDE B'], height: 0, widgets: [], selectable: true },
  ],
  scroll: 0,
  selected: '',
});

const createTapeHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'tape',
    title: 'TAPE',
    row: 0,
    column: 0,
    width: 90,
    height: 60,
    widgets: [TRACKS],
  });

const PLAY_ROW = 20;

const PLAY_COLUMN = 50;

describe('handleHud', () => {
  it('should return a grab on the window when a press lands on its title bar', () => {
    expect(
      handleHud(createStreetHud(), { kind: 'PRESS', row: 16, column: 30 }).hud
        .grab,
    ).toMatchObject({ kind: 'DRAG', window: 'street' });
  });

  it('should return the window moved when the pointer moves', () => {
    expect(
      findHudWindow(
        handleHud(
          handleHud(createStreetHud(), { kind: 'PRESS', row: 16, column: 30 })
            .hud,
          { kind: 'MOVE', row: 26, column: 40 },
        ).hud,
        'street',
      ),
    ).toMatchObject({ row: 20, column: 30 });
  });

  it('should return a click action when a press and a release land on a button', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'PRESS', row: 30, column: 30 })
          .hud,
        { kind: 'RELEASE', row: 30, column: 30 },
      ).actions,
    ).toEqual([{ kind: 'CLICK', window: 'street', widget: 'skip', value: '' }]);
  });

  it('should return a click action naming the button when a press and a release land on one that sits on an item of a list', () => {
    expect(
      handleHud(
        handleHud(createTapeHud(), {
          kind: 'PRESS',
          row: PLAY_ROW,
          column: PLAY_COLUMN,
        }).hud,
        { kind: 'RELEASE', row: PLAY_ROW, column: PLAY_COLUMN },
      ).actions,
    ).toEqual([{ kind: 'CLICK', window: 'tape', widget: 'play-a', value: '' }]);
  });

  it('should return nothing selected when a press and a release land on a button that sits on an item', () => {
    expect(
      findHudWidget(
        handleHud(
          handleHud(createTapeHud(), {
            kind: 'PRESS',
            row: PLAY_ROW,
            column: PLAY_COLUMN,
          }).hud,
          { kind: 'RELEASE', row: PLAY_ROW, column: PLAY_COLUMN },
        ).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ selected: '' });
  });

  it('should return the item selected when a press lands on it beside the button on it', () => {
    expect(
      handleHud(createTapeHud(), { kind: 'PRESS', row: PLAY_ROW, column: 10 })
        .actions,
    ).toEqual([
      { kind: 'SELECT', window: 'tape', widget: 'tracks', value: 'a' },
    ]);
  });

  it('should return the typed character in the field when a press set the focus on it', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'PRESS', row: 48, column: 30 })
          .hud,
        { kind: 'KEY', key: 'A' },
      ).actions,
    ).toEqual([{ kind: 'TYPE', window: 'street', widget: 'note', value: 'A' }]);
  });

  it('should return the HUD without the window when a press and a release land on its close box', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'PRESS', row: 16, column: 101 })
          .hud,
        { kind: 'RELEASE', row: 16, column: 101 },
      ).hud.windows,
    ).toEqual([]);
  });

  it('should return the HUD as it was when it holds no windows', () => {
    expect(
      handleHud(createHud(), { kind: 'PRESS', row: 16, column: 30 }).hud,
    ).toEqual(createHud());
  });

  it('should return no actions when a key goes down and no field has the focus', () => {
    expect(
      handleHud(createStreetHud(), { kind: 'KEY', key: 'A' }).actions,
    ).toEqual([]);
  });

  it('should not change the HUD it is given when it handles an event', () => {
    const hud = createStreetHud();

    handleHud(hud, { kind: 'PRESS', row: 16, column: 30 });

    expect(hud).toEqual(createStreetHud());
  });
});
