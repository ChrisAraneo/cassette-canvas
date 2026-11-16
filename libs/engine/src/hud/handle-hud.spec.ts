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

const STREET_ROW = 10;

const STREET_COLUMN = 20;

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: STREET_ROW,
    column: STREET_COLUMN,
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

const TITLE_BAR_ROW = 16;

const TITLE_BAR_COLUMN = 30;

const CLOSE_BOX_COLUMN = 101;

const DRAG_DISTANCE = 10;

const SKIP_ROW = 30;

const SKIP_COLUMN = 30;

const NOTE_ROW = 48;

const NOTE_COLUMN = 30;

const ITEM_COLUMN = 10;

describe('handleHud', () => {
  it('should return a grab on the window when a press lands on its title bar', () => {
    expect(
      handleHud(createStreetHud(), {
        kind: 'PRESS',
        row: TITLE_BAR_ROW,
        column: TITLE_BAR_COLUMN,
      }).hud.grab,
    ).toMatchObject({ kind: 'DRAG', window: 'street' });
  });

  it('should return the window moved when the pointer moves', () => {
    expect(
      findHudWindow(
        handleHud(
          handleHud(createStreetHud(), {
            kind: 'PRESS',
            row: TITLE_BAR_ROW,
            column: TITLE_BAR_COLUMN,
          }).hud,
          {
            kind: 'MOVE',
            row: TITLE_BAR_ROW + DRAG_DISTANCE,
            column: TITLE_BAR_COLUMN + DRAG_DISTANCE,
          },
        ).hud,
        'street',
      ),
    ).toMatchObject({
      row: STREET_ROW + DRAG_DISTANCE,
      column: STREET_COLUMN + DRAG_DISTANCE,
    });
  });

  it('should return a click action when a press and a release land on a button', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), {
          kind: 'PRESS',
          row: SKIP_ROW,
          column: SKIP_COLUMN,
        }).hud,
        { kind: 'RELEASE', row: SKIP_ROW, column: SKIP_COLUMN },
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
      handleHud(createTapeHud(), {
        kind: 'PRESS',
        row: PLAY_ROW,
        column: ITEM_COLUMN,
      }).actions,
    ).toEqual([
      { kind: 'SELECT', window: 'tape', widget: 'tracks', value: 'a' },
    ]);
  });

  it('should return the typed character in the field when a press set the focus on it', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), {
          kind: 'PRESS',
          row: NOTE_ROW,
          column: NOTE_COLUMN,
        }).hud,
        { kind: 'KEY', key: 'A' },
      ).actions,
    ).toEqual([{ kind: 'TYPE', window: 'street', widget: 'note', value: 'A' }]);
  });

  it('should return the HUD without the window when a press and a release land on its close box', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), {
          kind: 'PRESS',
          row: TITLE_BAR_ROW,
          column: CLOSE_BOX_COLUMN,
        }).hud,
        { kind: 'RELEASE', row: TITLE_BAR_ROW, column: CLOSE_BOX_COLUMN },
      ).hud.windows,
    ).toEqual([]);
  });

  it('should return the HUD as it was when it holds no windows', () => {
    expect(
      handleHud(createHud(), {
        kind: 'PRESS',
        row: TITLE_BAR_ROW,
        column: TITLE_BAR_COLUMN,
      }).hud,
    ).toEqual(createHud());
  });

  it('should return no actions when a key goes down and no field has the focus', () => {
    expect(
      handleHud(createStreetHud(), { kind: 'KEY', key: 'A' }).actions,
    ).toEqual([]);
  });

  it('should not change the HUD it is given when it handles an event', () => {
    const hud = createStreetHud();

    handleHud(hud, {
      kind: 'PRESS',
      row: TITLE_BAR_ROW,
      column: TITLE_BAR_COLUMN,
    });

    expect(hud).toEqual(createStreetHud());
  });
});
