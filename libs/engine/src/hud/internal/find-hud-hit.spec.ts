import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { findHudHit } from './find-hud-hit';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'tabs',
    id: 'tabs',
    page: '',
    row: 0,
    column: 0,
    tabs: [
      { id: 'scene', text: 'SCENE' },
      { id: 'light', text: 'LIGHT' },
    ],
  },
  {
    kind: 'button',
    id: 'skip',
    page: 'scene',
    row: 16,
    column: 0,
    width: 30,
    text: 'SKIP',
  },
  {
    kind: 'label',
    id: 'lamps',
    page: 'light',
    row: 16,
    column: 0,
    text: 'LAMPS',
  },
]);

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
    widgets: WIDGETS,
  });

describe('findHudHit', () => {
  it('should return undefined when the point is over no window', () => {
    expect(findHudHit(createStreetHud(), 0, 0)).toBeUndefined();
  });

  it('should return the title bar when the point is in the top band of the window', () => {
    expect(findHudHit(createStreetHud(), 16, 30)).toEqual({
      window: 'street',
      part: 'title',
      widget: '',
    });
  });

  it('should return the close box when the point is at the right of the title bar', () => {
    expect(findHudHit(createStreetHud(), 16, 101)).toEqual({
      window: 'street',
      part: 'close',
      widget: '',
    });
  });

  it('should return the title bar at the close box when the window cannot be closed', () => {
    expect(
      findHudHit(
        addHudWindow(createHud(), {
          id: 'street',
          title: 'STREET',
          row: 10,
          column: 20,
          width: 90,
          height: 76,
          closable: false,
          widgets: WIDGETS,
        }),
        16,
        101,
      ),
    ).toMatchObject({ part: 'title' });
  });

  it('should return the widget when the point is over one on the open page', () => {
    expect(findHudHit(createStreetHud(), 46, 30)).toEqual({
      window: 'street',
      part: 'widget',
      widget: 'skip',
    });
  });

  it('should return the widget of the open page when one of another page sits at the same place', () => {
    expect(
      findHudHit(
        addHudWindow(createStreetHud(), {
          id: 'street',
          title: 'STREET',
          row: 10,
          column: 20,
          width: 90,
          height: 76,
          page: 'light',
          widgets: WIDGETS,
        }),
        46,
        30,
      ),
    ).toMatchObject({ part: 'widget', widget: 'lamps' });
  });

  it('should return the body when the window holds nothing there', () => {
    expect(findHudHit(createStreetHud(), 80, 100)).toEqual({
      window: 'street',
      part: 'body',
      widget: '',
    });
  });

  it('should return the window on top when two of them overlap', () => {
    expect(
      findHudHit(
        addHudWindow(createStreetHud(), {
          id: 'notes',
          title: 'NOTES',
          row: 10,
          column: 20,
          width: 90,
          height: 76,
        }),
        80,
        100,
      ),
    ).toMatchObject({ window: 'notes' });
  });
});
