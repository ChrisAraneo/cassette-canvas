import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { pressHudList } from './press-hud-list';

const toItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

/** A list 48 rows tall, which shows four of its six items at once. */
const LIST: HudList = Object.freeze({
  kind: 'list',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: toItems(6),
  scroll: 0,
  selected: '',
});

const LAYOUT = computeListLayout(LIST);

/** The same list scrolled on by one item, and the thumb where that puts it. */
const SCROLLED: HudList = Object.freeze({ ...LIST, scroll: 1 });

const SCROLLED_THUMB = computeListLayout(SCROLLED).thumb;

/** The same six items under a heading that takes no selection. */
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

const pressList = (widget: HudList, row: number, column: number) =>
  pressHudList(createDeckHud(widget), 'deck', widget, row, column);

describe('pressHudList', () => {
  it('should return the list scrolled on by one item when the pointer presses the down arrow', () => {
    expect(
      findHudWidget(
        pressList(LIST, LAYOUT.down.row + 5, LAYOUT.down.column + 5).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the list scrolled back by one item when the pointer presses the up arrow', () => {
    expect(
      findHudWidget(
        pressList(
          { ...LIST, scroll: 2 },
          LAYOUT.up.row + 5,
          LAYOUT.up.column + 5,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the first item when the pointer presses the up arrow on it', () => {
    expect(
      findHudWidget(
        pressList(LIST, LAYOUT.up.row + 5, LAYOUT.up.column + 5).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 0 });
  });

  it('should return the last page when the pointer presses the down arrow on it', () => {
    expect(
      findHudWidget(
        pressList(
          { ...LIST, scroll: 2 },
          LAYOUT.down.row + 5,
          LAYOUT.down.column + 5,
        ).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return no actions when the pointer scrolls a list', () => {
    expect(
      pressList(LIST, LAYOUT.down.row + 5, LAYOUT.down.column + 5).actions,
    ).toEqual([]);
  });

  it('should return the item selected when the pointer presses one', () => {
    const rect = LAYOUT.items[1]?.rect;

    expect(
      findHudWidget(
        pressList(LIST, (rect?.row ?? 0) + 2, (rect?.column ?? 0) + 2).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ selected: '1' });
  });

  it('should return a select action naming the item when the pointer presses one', () => {
    const rect = LAYOUT.items[1]?.rect;

    expect(
      pressList(LIST, (rect?.row ?? 0) + 2, (rect?.column ?? 0) + 2).actions,
    ).toEqual([
      { kind: 'select', window: 'deck', widget: 'tracks', value: '1' },
    ]);
  });

  it('should return the item the scroll starts at when the pointer presses the first row of a scrolled list', () => {
    const rect = LAYOUT.items[0]?.rect;

    expect(
      pressList(
        { ...LIST, scroll: 2 },
        (rect?.row ?? 0) + 2,
        (rect?.column ?? 0) + 2,
      ).actions,
    ).toEqual([
      { kind: 'select', window: 'deck', widget: 'tracks', value: '2' },
    ]);
  });

  it('should return nothing selected when the pointer presses the track between the arrows', () => {
    expect(
      findHudWidget(
        pressList(LIST, LAYOUT.track.row + 2, LAYOUT.track.column + 2).hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ selected: '', scroll: 0 });
  });

  it('should return no actions when the pointer presses an empty list', () => {
    const rect = LAYOUT.items[0]?.rect;

    expect(
      pressList(
        { ...LIST, items: [] },
        (rect?.row ?? 0) + 2,
        (rect?.column ?? 0) + 2,
      ).actions,
    ).toEqual([]);
  });

  it('should take hold of the thumb when the pointer presses it, so a move can drag it', () => {
    expect(
      pressList(LIST, LAYOUT.thumb.row + 2, LAYOUT.thumb.column + 3).hud.grab,
    ).toEqual({
      kind: 'scroll',
      window: 'deck',
      widget: 'tracks',
      row: 2,
      column: 3,
    });
  });

  it('should return the scroll it was on when the pointer takes hold of the thumb', () => {
    expect(
      findHudWidget(
        pressList(SCROLLED, SCROLLED_THUMB.row + 2, SCROLLED_THUMB.column + 2)
          .hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return no actions when the pointer takes hold of the thumb', () => {
    expect(
      pressList(LIST, LAYOUT.thumb.row + 2, LAYOUT.thumb.column + 2).actions,
    ).toEqual([]);
  });

  it('should return no grab at all when the pointer presses a list with no thumb to drag', () => {
    const short: HudList = { ...LIST, items: toItems(2) };
    const thumb = computeListLayout(short).track;

    expect(
      pressList(short, thumb.row + 2, thumb.column + 2).hud.grab,
    ).toBeUndefined();
  });

  it('should return nothing selected when the pointer presses an item that cannot be selected', () => {
    const rect = HEADING_LAYOUT.items[0]?.rect;

    expect(
      findHudWidget(
        pressList(HEADING_LIST, (rect?.row ?? 0) + 2, (rect?.column ?? 0) + 2)
          .hud,
        'deck',
        'tracks',
      ),
    ).toMatchObject({ selected: '' });
  });

  it('should return no actions when the pointer presses an item that cannot be selected', () => {
    const rect = HEADING_LAYOUT.items[0]?.rect;

    expect(
      pressList(HEADING_LIST, (rect?.row ?? 0) + 2, (rect?.column ?? 0) + 2)
        .actions,
    ).toEqual([]);
  });

  it('should return the item under a heading selected when the pointer presses that one', () => {
    const rect = HEADING_LAYOUT.items[1]?.rect;

    expect(
      pressList(HEADING_LIST, (rect?.row ?? 0) + 2, (rect?.column ?? 0) + 2)
        .actions,
    ).toEqual([
      { kind: 'select', window: 'deck', widget: 'tracks', value: '0' },
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
      pressList(tall, (rect?.row ?? 0) + 14, (rect?.column ?? 0) + 2).actions,
    ).toEqual([
      { kind: 'select', window: 'deck', widget: 'tracks', value: 'neon' },
    ]);
  });

  it('should return no grab and no focus when the pointer presses a list', () => {
    const pressed = pressList(
      LIST,
      LAYOUT.down.row + 5,
      LAYOUT.down.column + 5,
    ).hud;

    expect([pressed.grab, pressed.focus]).toEqual([undefined, undefined]);
  });
});
