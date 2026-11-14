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
  it('should return every setting it is given when it makes a window', () => {
    expect(toHudWindow(createHud(), SETTINGS)).toMatchObject(SETTINGS);
  });

  it('should return the color of the HUD when none is given', () => {
    expect(toHudWindow(createHud(3), SETTINGS).color).toBe(3);
  });

  it('should return the color of the window when it has one', () => {
    expect(toHudWindow(createHud(3), { ...SETTINGS, color: 9 }).color).toBe(9);
  });

  it('should return a closable window when nothing says otherwise', () => {
    expect(toHudWindow(createHud(), SETTINGS).closable).toBe(true);
  });

  it('should return no widgets when none are given', () => {
    expect(toHudWindow(createHud(), SETTINGS).widgets).toEqual([]);
  });

  it('should return the first tab as the page when none is given', () => {
    expect(
      toHudWindow(createHud(), { ...SETTINGS, widgets: [TABS] }).page,
    ).toBe('scene');
  });

  it('should return the page it is given when it makes a window', () => {
    expect(
      toHudWindow(createHud(), {
        ...SETTINGS,
        page: 'light',
        widgets: [TABS],
      }).page,
    ).toBe('light');
  });
});
