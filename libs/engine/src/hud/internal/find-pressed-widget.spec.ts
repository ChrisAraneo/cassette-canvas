import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { findPressedWidget } from './find-pressed-widget';
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

const FPS: HudWidget = Object.freeze({
  kind: 'LABEL',
  id: 'fps',
  page: '',
  row: 16,
  column: 0,
  text: 'FPS 60',
});

const createDeck = (widgets: readonly HudWidget[]): HudWindow =>
  toHudWindow(createHud(), {
    id: 'deck',
    title: 'DECK',
    row: 0,
    column: 0,
    width: 120,
    height: 90,
    widgets,
  });

const DECK = createDeck([SKIP, FPS]);

const SKIP_RECT = computeWidgetRect(SKIP);

const INSIDE_WIDGET = 2;

describe('findPressedWidget', () => {
  it('should find the widget under the pointer when it sits on one', () => {
    expect(
      findPressedWidget(
        DECK,
        SKIP_RECT.row + INSIDE_WIDGET,
        SKIP_RECT.column + INSIDE_WIDGET,
      )?.widget.id,
    ).toBe('skip');
  });

  it('should find nothing when the pointer sits on no widget at all', () => {
    expect(findPressedWidget(DECK, 0, 0)).toBeUndefined();
  });

  it('should find nothing when the window holds no widgets', () => {
    expect(
      findPressedWidget(
        createDeck([]),
        SKIP_RECT.row + INSIDE_WIDGET,
        SKIP_RECT.column + INSIDE_WIDGET,
      ),
    ).toBeUndefined();
  });

  it('should find the last widget it paints when two sit on the same pixel', () => {
    expect(
      findPressedWidget(
        createDeck([SKIP, { ...SKIP, id: 'stop' }]),
        SKIP_RECT.row + INSIDE_WIDGET,
        SKIP_RECT.column + INSIDE_WIDGET,
      )?.widget.id,
    ).toBe('stop');
  });
});
