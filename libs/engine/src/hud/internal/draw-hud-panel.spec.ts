import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_BODY_SHADE } from '../consts';
import { createHud } from '../create-hud';
import type { HudPanel } from '../types/hud-panel';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { drawHudPanel } from './draw-hud-panel';
import { drawPanel } from './draw-panel';
import { toWindowTheme } from './to-window-theme';

const WINDOW_COLOR = 9;

const PANEL: HudPanel = Object.freeze({
  kind: 'PANEL',
  id: 'meters',
  page: '',
  row: 4,
  column: 0,
  width: 60,
  height: 20,
});

const WINDOW: HudWindow = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 80,
  height: 60,
  color: WINDOW_COLOR,
  closable: true,
  page: '',
  widgets: [PANEL],
});

describe('drawHudPanel', () => {
  it('should return the surface a window is built from when it paints a panel', () => {
    expect(drawHudPanel(createHud(), WINDOW, PANEL)).toEqual(
      drawPanel(computeWidgetRect(PANEL), toWindowTheme(createHud(), WINDOW)),
    );
  });

  it('should return the panel in the window own color when the window has one of its own', () => {
    expect(drawHudPanel(createHud(), WINDOW, PANEL)[0]).toMatchObject({
      pixel: toPixel(WINDOW_COLOR, HUD_BODY_SHADE),
    });
  });

  it('should return the panel where the widget sits when it paints one', () => {
    expect(drawHudPanel(createHud(), WINDOW, PANEL)[0]).toMatchObject(
      computeWidgetRect(PANEL),
    );
  });
});
