import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { handleWindowPart } from './handle-window-part';
import { toHudWindow } from './to-hud-window';

const SKIP: HudWidget = Object.freeze({
  kind: 'BUTTON',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 30,
  text: 'SKIP',
});

const SETTINGS = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 120,
  height: 90,
  widgets: Object.freeze([SKIP]),
});

const createDeckHud = (): Hud => ({
  ...addHudWindow(createHud(), SETTINGS),
  focus: { window: 'deck', widget: 'skip' },
});

const DECK: HudWindow = toHudWindow(createHud(), SETTINGS);

const CLOSE_HIT = Object.freeze({
  window: 'deck',
  part: 'CLOSE',
  widget: '',
});

const TITLE_HIT = Object.freeze({
  window: 'deck',
  part: 'TITLE',
  widget: '',
});

const WIDGET_HIT = Object.freeze({
  window: 'deck',
  part: 'WIDGET',
  widget: 'skip',
});

const BODY_HIT = Object.freeze({ window: 'deck', part: 'BODY', widget: '' });

describe('handleWindowPart', () => {
  it('should take hold of the close box when the press is on it', () => {
    expect(
      handleWindowPart(createDeckHud(), DECK, CLOSE_HIT, 4, 6).hud.grab,
    ).toEqual({
      kind: 'CLOSE',
      window: 'deck',
      widget: '',
      row: 4,
      column: 6,
    });
  });

  it('should take hold of the title bar when the press is on it', () => {
    expect(
      handleWindowPart(createDeckHud(), DECK, TITLE_HIT, 4, 6).hud.grab,
    ).toEqual({
      kind: 'DRAG',
      window: 'deck',
      widget: '',
      row: 4,
      column: 6,
    });
  });

  it('should take hold of the button when the press is on a widget', () => {
    expect(
      handleWindowPart(createDeckHud(), DECK, WIDGET_HIT, 4, 6).hud.grab,
    ).toMatchObject({ kind: 'PRESS', widget: 'skip' });
  });

  it('should let the grab and the focus go when the press is on the body', () => {
    const change = handleWindowPart(createDeckHud(), DECK, BODY_HIT, 4, 6);

    expect([change.hud.grab, change.hud.focus]).toEqual([undefined, undefined]);
  });

  it('should let the focus go when the press is on the title bar', () => {
    expect(
      handleWindowPart(createDeckHud(), DECK, TITLE_HIT, 4, 6).hud.focus,
    ).toBeUndefined();
  });

  it('should return no actions when it handles a press on a part of a window', () => {
    expect(
      handleWindowPart(createDeckHud(), DECK, CLOSE_HIT, 4, 6).actions,
    ).toEqual([]);
  });

  it('should not change the old HUD when it handles a press', () => {
    const hud = createDeckHud();

    handleWindowPart(hud, DECK, CLOSE_HIT, 4, 6);

    expect(hud).toEqual(createDeckHud());
  });
});
