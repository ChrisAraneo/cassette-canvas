import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { computeTitleRect } from './compute-title-rect';
import { computeWidgetRect } from './compute-widget-rect';
import { toHudWindow } from './to-hud-window';
import { toWindowHit } from './to-window-hit';

const SKIP: HudWidget = Object.freeze({
  kind: 'BUTTON',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 30,
  text: 'SKIP',
});

const createDeck = (closable: boolean): HudWindow =>
  toHudWindow(createHud(), {
    id: 'deck',
    title: 'DECK',
    row: 0,
    column: 0,
    width: 120,
    height: 90,
    closable,
    widgets: [SKIP],
  });

const DECK = createDeck(true);

const CLOSE_RECT = computeCloseRect(DECK);

const TITLE_RECT = computeTitleRect(DECK);

const SKIP_RECT = computeWidgetRect(SKIP);

const INSIDE_PART = 2;

describe('toWindowHit', () => {
  it('should hit the close box when the pointer sits on it', () => {
    expect(
      toWindowHit(
        DECK,
        CLOSE_RECT.row + INSIDE_PART,
        CLOSE_RECT.column + INSIDE_PART,
      ),
    ).toEqual({ window: 'deck', part: 'CLOSE', widget: '' });
  });

  it('should hit the title bar when the pointer sits on it away from the close box', () => {
    expect(
      toWindowHit(DECK, TITLE_RECT.row + INSIDE_PART, TITLE_RECT.column + 1),
    ).toEqual({ window: 'deck', part: 'TITLE', widget: '' });
  });

  it('should hit the widget when the pointer sits on one', () => {
    expect(
      toWindowHit(
        DECK,
        SKIP_RECT.row + INSIDE_PART,
        SKIP_RECT.column + INSIDE_PART,
      ),
    ).toEqual({ window: 'deck', part: 'WIDGET', widget: 'skip' });
  });

  it('should hit the body when the pointer sits on no part of the window', () => {
    expect(toWindowHit(DECK, 80, 100)).toEqual({
      window: 'deck',
      part: 'BODY',
      widget: '',
    });
  });

  it('should hit the title bar when the window cannot be closed and the pointer sits where the box would be', () => {
    expect(
      toWindowHit(
        createDeck(false),
        CLOSE_RECT.row + INSIDE_PART,
        CLOSE_RECT.column + INSIDE_PART,
      ).part,
    ).toBe('TITLE');
  });
});
