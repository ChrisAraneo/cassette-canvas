import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudPanel } from '../types/hud-panel';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { paintHudPanel } from './paint-hud-panel';
import { paintPanel } from './paint-panel';
import { toWindowTheme } from './to-window-theme';

const PANEL: HudPanel = Object.freeze({
  kind: 'panel',
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
  color: 9,
  closable: true,
  page: '',
  widgets: [PANEL],
});

describe('paintHudPanel', () => {
  it('should return the surface a window is built from when it paints a panel', () => {
    expect(paintHudPanel(createHud(), WINDOW, PANEL)).toEqual(
      paintPanel(computeWidgetRect(PANEL), toWindowTheme(createHud(), WINDOW)),
    );
  });

  it('should return the panel in the window own color when the window has one of its own', () => {
    expect(paintHudPanel(createHud(), WINDOW, PANEL)[0]).toMatchObject({
      pixel: 0x95,
    });
  });

  it('should return the panel where the widget sits when it paints one', () => {
    expect(paintHudPanel(createHud(), WINDOW, PANEL)[0]).toMatchObject(
      computeWidgetRect(PANEL),
    );
  });
});
