import { floor, last } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudButton } from '../types/hud-button';
import type { HudWindow } from '../types/hud-window';
import { computeTextWidth } from './compute-text-width';
import { computeWidgetRect } from './compute-widget-rect';
import { paintHudButton } from './paint-hud-button';

const BUTTON: HudButton = Object.freeze({
  kind: 'button',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 40,
  text: 'SKIP',
});

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: [BUTTON],
});

const THEME = createHud().theme;

const createHoldingHud = (): Hud => ({
  ...createHud(),
  grab: { kind: 'press', window: 'street', widget: 'skip', row: 0, column: 0 },
});

describe('paintHudButton', () => {
  it('should fill the button with the light face of the theme', () => {
    expect(paintHudButton(createHud(), WINDOW, BUTTON)[0]).toEqual({
      pixel: toPixel(15, THEME.face),
      ...computeWidgetRect(BUTTON),
    });
  });

  it('should light the top of the button while it rests', () => {
    expect(paintHudButton(createHud(), WINDOW, BUTTON)[1]).toMatchObject({
      pixel: toPixel(15, THEME.highlight),
    });
  });

  it('should turn the bevel around while it is held', () => {
    expect(paintHudButton(createHoldingHud(), WINDOW, BUTTON)[1]).toMatchObject(
      { pixel: toPixel(15, THEME.shadow) },
    );
  });

  it('should put the text in the middle of the button', () => {
    expect(last(paintHudButton(createHud(), WINDOW, BUTTON))).toMatchObject({
      column:
        computeWidgetRect(BUTTON).column +
        floor((40 - computeTextWidth('SKIP')) / 2),
    });
  });

  it('should move the text down and right while it is held', () => {
    expect(
      last(paintHudButton(createHoldingHud(), WINDOW, BUTTON)),
    ).toMatchObject({
      row: (last(paintHudButton(createHud(), WINDOW, BUTTON))?.row ?? 0) + 1,
    });
  });
});
