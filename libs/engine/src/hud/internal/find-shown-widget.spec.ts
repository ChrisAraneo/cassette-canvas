import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { findShownWidget } from './find-shown-widget';

const toPlay = (id: string): HudItemWidget => ({
  kind: 'button',
  id: `play-${id}`,
  page: '',
  row: 3,
  column: 40,
  width: 20,
  text: 'PLAY',
});

const toItem = (id: string): HudListItem => ({
  id,
  lines: [`SIDE ${id}`],
  height: 20,
  widgets: [toPlay(id)],
  selectable: true,
});

/** A list 48 rows tall, which shows two of its three items at once. */
const LIST: HudList = Object.freeze({
  kind: 'list',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: [toItem('a'), toItem('b'), toItem('c')],
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
    height: 80,
    widgets: [LIST],
  });

describe('findShownWidget', () => {
  it('should return the widget when the window holds it itself', () => {
    expect(findShownWidget(createTapeHud(), 'tape', 'tracks')).toMatchObject({
      kind: 'list',
      id: 'tracks',
    });
  });

  it('should return the button when it sits on an item the list shows', () => {
    expect(findShownWidget(createTapeHud(), 'tape', 'play-b')).toMatchObject({
      kind: 'button',
      text: 'PLAY',
    });
  });

  it('should return undefined when the button sits on an item the list does not show', () => {
    expect(findShownWidget(createTapeHud(), 'tape', 'play-c')).toBeUndefined();
  });

  it('should return undefined when no widget has the id', () => {
    expect(findShownWidget(createTapeHud(), 'tape', 'rewind')).toBeUndefined();
  });

  it('should return undefined when no window has the id', () => {
    expect(findShownWidget(createTapeHud(), 'deck', 'tracks')).toBeUndefined();
  });
});
