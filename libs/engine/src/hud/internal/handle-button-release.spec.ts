import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudGrab } from '../types/hud-grab';
import type { HudWidget } from '../types/hud-widget';
import { computeWidgetRect } from './compute-widget-rect';
import { handleButtonRelease } from './handle-button-release';

const SKIP: HudWidget = Object.freeze({
  kind: 'BUTTON',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 30,
  text: 'SKIP',
});

const GRAB: HudGrab = Object.freeze({
  kind: 'PRESS',
  window: 'deck',
  widget: 'skip',
  row: 2,
  column: 2,
});

const createDeckHud = (): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'deck',
    title: 'DECK',
    row: 0,
    column: 0,
    width: 120,
    height: 90,
    widgets: [SKIP],
  }),
  grab: GRAB,
});

const SKIP_RECT = computeWidgetRect(SKIP);

const ON_BUTTON_ROW = SKIP_RECT.row + 2;

const ON_BUTTON_COLUMN = SKIP_RECT.column + 2;

describe('handleButtonRelease', () => {
  it('should return a CLICK when the button is still under the pointer', () => {
    expect(
      handleButtonRelease(
        createDeckHud(),
        GRAB,
        ON_BUTTON_ROW,
        ON_BUTTON_COLUMN,
      ).actions,
    ).toEqual([{ kind: 'CLICK', window: 'deck', widget: 'skip', value: '' }]);
  });

  it('should return no actions when the pointer has moved off the button', () => {
    expect(handleButtonRelease(createDeckHud(), GRAB, 80, 100).actions).toEqual(
      [],
    );
  });

  it('should return no actions when the pointer is over no window at all', () => {
    expect(
      handleButtonRelease(createDeckHud(), GRAB, 999, 999).actions,
    ).toEqual([]);
  });

  it('should let the grab go when the button is still under the pointer', () => {
    expect(
      handleButtonRelease(
        createDeckHud(),
        GRAB,
        ON_BUTTON_ROW,
        ON_BUTTON_COLUMN,
      ).hud.grab,
    ).toBeUndefined();
  });

  it('should let the grab go when the pointer has moved off the button', () => {
    expect(
      handleButtonRelease(createDeckHud(), GRAB, 80, 100).hud.grab,
    ).toBeUndefined();
  });

  it('should keep the windows where they are when it lets a button go', () => {
    expect(
      map(
        handleButtonRelease(
          createDeckHud(),
          GRAB,
          ON_BUTTON_ROW,
          ON_BUTTON_COLUMN,
        ).hud.windows,
        (window) => window.id,
      ),
    ).toEqual(['deck']);
  });

  it('should not change the old HUD when it lets a button go', () => {
    const hud = createDeckHud();

    handleButtonRelease(hud, GRAB, ON_BUTTON_ROW, ON_BUTTON_COLUMN);

    expect(hud).toEqual(createDeckHud());
  });
});
