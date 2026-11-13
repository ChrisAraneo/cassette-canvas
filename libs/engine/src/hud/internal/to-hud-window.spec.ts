import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { HudWidget } from '../types/hud-widget';
import { toHudWindow } from './to-hud-window';

const SETTINGS = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 10,
  column: 20,
  width: 90,
  height: 76,
});

const TABS: HudWidget = Object.freeze({
  kind: 'tabs',
  id: 'tabs',
  page: '',
  row: 0,
  column: 0,
  tabs: [{ id: 'scene', text: 'SCENE' }],
});

describe('toHudWindow', () => {
  it('should keep every setting it is given', () => {
    expect(toHudWindow(createHud(), SETTINGS)).toMatchObject(SETTINGS);
  });

  it('should take the color of the HUD when none is given', () => {
    expect(toHudWindow(createHud(3), SETTINGS).color).toBe(3);
  });

  it('should keep a color of its own', () => {
    expect(toHudWindow(createHud(3), { ...SETTINGS, color: 9 }).color).toBe(9);
  });

  it('should let the window be closed unless it is told otherwise', () => {
    expect(toHudWindow(createHud(), SETTINGS).closable).toBe(true);
  });

  it('should hold no widgets when none are given', () => {
    expect(toHudWindow(createHud(), SETTINGS).widgets).toEqual([]);
  });

  it('should open the first tab when no page is given', () => {
    expect(
      toHudWindow(createHud(), { ...SETTINGS, widgets: [TABS] }).page,
    ).toBe('scene');
  });

  it('should keep the page it is given', () => {
    expect(
      toHudWindow(createHud(), {
        ...SETTINGS,
        page: 'light',
        widgets: [TABS],
      }).page,
    ).toBe('light');
  });
});
