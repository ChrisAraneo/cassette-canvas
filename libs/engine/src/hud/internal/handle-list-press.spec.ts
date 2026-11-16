import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { handleListPress } from './handle-list-press';

const createItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: createItems(6),
  scroll: 0,
  selected: '',
});

const INSIDE_ARROW = 5;

const INSIDE_PART = 2;

const INSIDE_THUMB_COLUMN = 3;

const SECOND_LINE_ROW = 14;

const LAYOUT = computeListLayout(LIST);

const SCROLLED: HudList = Object.freeze({ ...LIST, scroll: 1 });

const SCROLLED_THUMB = computeListLayout(SCROLLED).thumb;

const HEADING_LIST: HudList = Object.freeze({
  ...LIST,
  items: [
    {
      id: 'side',
      lines: ['SIDE A'],
      height: 0,
      widgets: [],
      selectable: false,
    },
    ...LIST.items,
  ],
});

const HEADING_LAYOUT = computeListLayout(HEADING_LIST);

const createDeckHud = (widget: HudList = LIST): Hud =>
  addHudWindow(createHud(), {
    id: 'deck',
    title: 'DECK',
    row: 0,
    column: 0,
    width: 90,
    height: 80,
    widgets: [widget],
  });

const handlePressAt = (
  widget: HudList,
  row: number,
  column: number,
): HudChange =>
  handleListPress(createDeckHud(widget), 'deck', widget, row, column);

describe('handleListPress', () => {
  it('should return the list scrolled on by one item when the pointer presses the down arrow', () => {
    expect(
      findHudWidget(
        handlePressAt(
          LIST,
          LAYOUT.down.row + INSIDE_ARROW,
          LAYOUT.down.column + INSIDE_ARROW,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the list scrolled back by one item when the pointer presses the up arrow', () => {
    expect(
      findHudWidget(
        handlePressAt(
          { ...LIST, scroll: 2 },
          LAYOUT.up.row + INSIDE_ARROW,
          LAYOUT.up.column + INSIDE_ARROW,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the first item when the pointer presses the up arrow on it', () => {
    expect(
      findHudWidget(
        handlePressAt(
          LIST,
          LAYOUT.up.row + INSIDE_ARROW,
          LAYOUT.up.column + INSIDE_ARROW,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 0 });
  });

  it('should return the last page when the pointer presses the down arrow on it', () => {
    expect(
      findHudWidget(
        handlePressAt(
          { ...LIST, scroll: 2 },
          LAYOUT.down.row + INSIDE_ARROW,
          LAYOUT.down.column + INSIDE_ARROW,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return no actions when the pointer scrolls a list', () => {
    expect(
      handlePressAt(
        LIST,
        LAYOUT.down.row + INSIDE_ARROW,
        LAYOUT.down.column + INSIDE_ARROW,
      ).actions,
    ).toEqual([]);
  });

  it('should return the item selected when the pointer presses one', () => {
    const rect = LAYOUT.items[1]?.rect;

    expect(
      findHudWidget(
        handlePressAt(
          LIST,
          (rect?.row ?? 0) + INSIDE_PART,
          (rect?.column ?? 0) + INSIDE_PART,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ selected: '1' });
  });

  it('should return a select action naming the item when the pointer presses one', () => {
    const rect = LAYOUT.items[1]?.rect;

    expect(
      handlePressAt(
        LIST,
        (rect?.row ?? 0) + INSIDE_PART,
        (rect?.column ?? 0) + INSIDE_PART,
      ).actions,
    ).toEqual([
      { kind: 'SELECT', window: 'deck', widget: 'tracks', value: '1' },
    ]);
  });

  it('should return the item the scroll starts at when the pointer presses the first row of a scrolled list', () => {
    const rect = LAYOUT.items[0]?.rect;

    expect(
      handlePressAt(
        { ...LIST, scroll: 2 },
        (rect?.row ?? 0) + INSIDE_PART,
        (rect?.column ?? 0) + INSIDE_PART,
      ).actions,
    ).toEqual([
      { kind: 'SELECT', window: 'deck', widget: 'tracks', value: '2' },
    ]);
  });

  it('should return nothing selected when the pointer presses the track between the arrows', () => {
    expect(
      findHudWidget(
        handlePressAt(
          LIST,
          LAYOUT.track.row + INSIDE_PART,
          LAYOUT.track.column + INSIDE_PART,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ selected: '', scroll: 0 });
  });

  it('should return no actions when the pointer presses an empty list', () => {
    const rect = LAYOUT.items[0]?.rect;

    expect(
      handlePressAt(
        { ...LIST, items: [] },
        (rect?.row ?? 0) + INSIDE_PART,
        (rect?.column ?? 0) + INSIDE_PART,
      ).actions,
    ).toEqual([]);
  });

  it('should take hold of the thumb when the pointer presses it, so a move can drag it', () => {
    expect(
      handlePressAt(
        LIST,
        LAYOUT.thumb.row + INSIDE_PART,
        LAYOUT.thumb.column + INSIDE_THUMB_COLUMN,
      ).hud.grab,
    ).toEqual({
      kind: 'SCROLL',
      window: 'deck',
      widget: 'tracks',
      row: INSIDE_PART,
      column: INSIDE_THUMB_COLUMN,
    });
  });

  it('should return the scroll it was on when the pointer takes hold of the thumb', () => {
    expect(
      findHudWidget(
        handlePressAt(
          SCROLLED,
          SCROLLED_THUMB.row + INSIDE_PART,
          SCROLLED_THUMB.column + INSIDE_PART,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return no actions when the pointer takes hold of the thumb', () => {
    expect(
      handlePressAt(
        LIST,
        LAYOUT.thumb.row + INSIDE_PART,
        LAYOUT.thumb.column + INSIDE_PART,
      ).actions,
    ).toEqual([]);
  });

  it('should return no grab at all when the pointer presses a list with no thumb to drag', () => {
    const short: HudList = { ...LIST, items: createItems(2) };
    const thumb = computeListLayout(short).track;

    expect(
      handlePressAt(short, thumb.row + INSIDE_PART, thumb.column + INSIDE_PART)
        .hud.grab,
    ).toBeUndefined();
  });

  it('should return nothing selected when the pointer presses an item that cannot be selected', () => {
    const rect = HEADING_LAYOUT.items[0]?.rect;

    expect(
      findHudWidget(
        handlePressAt(
          HEADING_LIST,
          (rect?.row ?? 0) + INSIDE_PART,
          (rect?.column ?? 0) + INSIDE_PART,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ selected: '' });
  });

  it('should return no actions when the pointer presses an item that cannot be selected', () => {
    const rect = HEADING_LAYOUT.items[0]?.rect;

    expect(
      handlePressAt(
        HEADING_LIST,
        (rect?.row ?? 0) + INSIDE_PART,
        (rect?.column ?? 0) + INSIDE_PART,
      ).actions,
    ).toEqual([]);
  });

  it('should return the item under a heading selected when the pointer presses that one', () => {
    const rect = HEADING_LAYOUT.items[1]?.rect;

    expect(
      handlePressAt(
        HEADING_LIST,
        (rect?.row ?? 0) + INSIDE_PART,
        (rect?.column ?? 0) + INSIDE_PART,
      ).actions,
    ).toEqual([
      { kind: 'SELECT', window: 'deck', widget: 'tracks', value: '0' },
    ]);
  });

  it('should return the second line of a taller item selected when the pointer presses it', () => {
    const tall: HudList = {
      ...LIST,
      items: [
        {
          id: 'neon',
          lines: ['NEON RAIN', '3:42'],
          height: 0,
          widgets: [],
          selectable: true,
        },
      ],
    };
    const rect = computeListLayout(tall).items[0]?.rect;

    expect(
      handlePressAt(
        tall,
        (rect?.row ?? 0) + SECOND_LINE_ROW,
        (rect?.column ?? 0) + INSIDE_PART,
      ).actions,
    ).toEqual([
      { kind: 'SELECT', window: 'deck', widget: 'tracks', value: 'neon' },
    ]);
  });

  it('should return no grab and no focus when the pointer presses a list', () => {
    const pressed = handlePressAt(
      LIST,
      LAYOUT.down.row + INSIDE_ARROW,
      LAYOUT.down.column + INSIDE_ARROW,
    ).hud;

    expect([pressed.grab, pressed.focus]).toEqual([undefined, undefined]);
  });
});
