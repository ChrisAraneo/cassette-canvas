import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { TEXT_ASCENT } from '../../text/consts';
import { toTextOverlay } from '../../text/to-text-overlay';
import { createHud } from '../create-hud';
import type { HudLabel } from '../types/hud-label';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { paintHudLabel } from './paint-hud-label';

const LABEL: HudLabel = Object.freeze({
  kind: 'label',
  id: 'fps',
  page: '',
  row: 4,
  column: 6,
  text: 'FPS 60',
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
  widgets: [LABEL],
});

describe('paintHudLabel', () => {
  it('should write the text in the dark shade of the theme', () => {
    expect(paintHudLabel(createHud(), WINDOW, LABEL)).toEqual([
      {
        image: toTextOverlay('FPS 60', toPixel(15, createHud().theme.text)),
        row: computeWidgetRect(LABEL).row - TEXT_ASCENT,
        column: computeWidgetRect(LABEL).column,
      },
    ]);
  });

  it('should write it in the color of the window', () => {
    expect(paintHudLabel(createHud(), { ...WINDOW, color: 9 }, LABEL)).toEqual([
      {
        image: toTextOverlay('FPS 60', toPixel(9, createHud().theme.text)),
        row: computeWidgetRect(LABEL).row - TEXT_ASCENT,
        column: computeWidgetRect(LABEL).column,
      },
    ]);
  });
});
