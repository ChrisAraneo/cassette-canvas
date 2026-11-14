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
    kind: 'button',
    id: 'skip',
    page: '',
    row: 0,
    column: 0,
    width: 30,
    text: 'SKIP',
  },
  {
    kind: 'input',
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

/** The play button on the first track, at the top of the item it sits on. */
const PLAY: HudItemWidget = Object.freeze({
  kind: 'button',
  id: 'play-a',
  page: '',
  row: 0,
  column: 40,
  width: 20,
  text: 'PLAY',
});

/** A list of two tracks, the first of them with a play button on it. */
const TRACKS: HudList = Object.freeze({
  kind: 'list',
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

/** Where the play button on the first item sits on the screen. */
const PLAY_ROW = 20;

const PLAY_COLUMN = 50;

describe('handleHud', () => {
  it('should return a grab on the window when a press lands on its title bar', () => {
    expect(
      handleHud(createStreetHud(), { kind: 'press', row: 16, column: 30 }).hud
        .grab,
    ).toMatchObject({ kind: 'drag', window: 'street' });
  });

  it('should return the window moved when the pointer moves', () => {
    expect(
      findHudWindow(
        handleHud(
          handleHud(createStreetHud(), { kind: 'press', row: 16, column: 30 })
            .hud,
          { kind: 'move', row: 26, column: 40 },
        ).hud,
        'street',
      ),
    ).toMatchObject({ row: 20, column: 30 });
  });

  it('should return a click action when a press and a release land on a button', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'press', row: 30, column: 30 })
          .hud,
        { kind: 'release', row: 30, column: 30 },
      ).actions,
    ).toEqual([{ kind: 'click', window: 'street', widget: 'skip', value: '' }]);
  });

  it('should return a click action naming the button when a press and a release land on one that sits on an item of a list', () => {
    expect(
      handleHud(
        handleHud(createTapeHud(), {
          kind: 'press',
          row: PLAY_ROW,
          column: PLAY_COLUMN,
        }).hud,
        { kind: 'release', row: PLAY_ROW, column: PLAY_COLUMN },
      ).actions,
    ).toEqual([{ kind: 'click', window: 'tape', widget: 'play-a', value: '' }]);
  });

  it('should return nothing selected when a press and a release land on a button that sits on an item', () => {
    expect(
      findHudWidget(
        handleHud(
          handleHud(createTapeHud(), {
            kind: 'press',
            row: PLAY_ROW,
            column: PLAY_COLUMN,
          }).hud,
          { kind: 'release', row: PLAY_ROW, column: PLAY_COLUMN },
        ).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ selected: '' });
  });

  it('should return the item selected when a press lands on it beside the button on it', () => {
    expect(
      handleHud(createTapeHud(), { kind: 'press', row: PLAY_ROW, column: 10 })
        .actions,
    ).toEqual([
      { kind: 'select', window: 'tape', widget: 'tracks', value: 'a' },
    ]);
  });

  it('should return the typed character in the field when a press set the focus on it', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'press', row: 48, column: 30 })
          .hud,
        { kind: 'key', key: 'A' },
      ).actions,
    ).toEqual([{ kind: 'type', window: 'street', widget: 'note', value: 'A' }]);
  });

  it('should return the HUD without the window when a press and a release land on its close box', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'press', row: 16, column: 101 })
          .hud,
        { kind: 'release', row: 16, column: 101 },
      ).hud.windows,
    ).toEqual([]);
  });

  it('should not change the HUD it is given when it handles an event', () => {
    const hud = createStreetHud();

    handleHud(hud, { kind: 'press', row: 16, column: 30 });

    expect(hud).toEqual(createStreetHud());
  });
});
