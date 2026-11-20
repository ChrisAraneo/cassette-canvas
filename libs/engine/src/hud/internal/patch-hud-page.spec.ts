import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudTabs } from '../types/hud-tabs';
import { computeTabRects } from './compute-tab-rects';
import { patchHudPage } from './patch-hud-page';

const COLUMN_PAST_TABS = 999;

const TABS: HudTabs = Object.freeze({
  kind: 'TABS',
  id: 'pages',
  page: '',
  row: 0,
  column: 0,
  tabs: Object.freeze([
    { id: 'tracks', text: 'TRACKS' },
    { id: 'about', text: 'ABOUT' },
  ]),
});

const createDeckHud = (): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'deck',
    title: 'DECK',
    row: 0,
    column: 0,
    width: 160,
    height: 90,
    widgets: [TABS],
  }),
  grab: { kind: 'PRESS', window: 'deck', widget: 'pages', row: 0, column: 0 },
  focus: { window: 'deck', widget: 'pages' },
});

const RECTS = computeTabRects(TABS);

const SECOND = RECTS[1];

const ON_SECOND_ROW = (SECOND?.row ?? 0) + 2;

const ON_SECOND_COLUMN = (SECOND?.column ?? 0) + 2;

describe('patchHudPage', () => {
  it('should open the page of the tab under the pointer when it presses one', () => {
    expect(
      findHudWindow(
        patchHudPage(
          createDeckHud(),
          'deck',
          TABS,
          ON_SECOND_ROW,
          ON_SECOND_COLUMN,
        ).hud,
        'deck',
      )?.page,
    ).toBe('about');
  });

  it('should return a TAB action naming the page when it opens one', () => {
    expect(
      patchHudPage(
        createDeckHud(),
        'deck',
        TABS,
        ON_SECOND_ROW,
        ON_SECOND_COLUMN,
      ).actions,
    ).toEqual([
      { kind: 'TAB', window: 'deck', widget: 'pages', value: 'about' },
    ]);
  });

  it('should let the grab and the focus go when it opens a page', () => {
    const change = patchHudPage(
      createDeckHud(),
      'deck',
      TABS,
      ON_SECOND_ROW,
      ON_SECOND_COLUMN,
    );

    expect([change.hud.grab, change.hud.focus]).toEqual([undefined, undefined]);
  });

  it('should do nothing at all when the pointer sits on no tab', () => {
    const hud = createDeckHud();

    expect(patchHudPage(hud, 'deck', TABS, 0, COLUMN_PAST_TABS)).toEqual({
      hud,
      actions: [],
    });
  });

  it('should do nothing at all when the strip holds no tabs', () => {
    const hud = createDeckHud();

    expect(patchHudPage(hud, 'deck', { ...TABS, tabs: [] }, 0, 0)).toEqual({
      hud,
      actions: [],
    });
  });

  it('should not change the old HUD when it opens a page', () => {
    const hud = createDeckHud();

    patchHudPage(hud, 'deck', TABS, ON_SECOND_ROW, ON_SECOND_COLUMN);

    expect(hud).toEqual(createDeckHud());
  });
});
