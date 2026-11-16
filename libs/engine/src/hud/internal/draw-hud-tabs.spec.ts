import { filter, findIndex, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import {
  DEFAULT_HUD_COLOR,
  HUD_CONTENT_LEFT,
  HUD_EDGE,
  HUD_TAB_DROP,
} from '../consts';
import { createHud } from '../create-hud';
import type { HudTabs } from '../types/hud-tabs';
import type { HudWindow } from '../types/hud-window';
import { computeContentWidth } from './compute-content-width';
import { computeTabRects } from './compute-tab-rects';
import { drawHudTabs } from './draw-hud-tabs';

const LINE_ONLY = 1;

const TABS: HudTabs = Object.freeze({
  kind: 'TABS',
  id: 'tabs',
  page: '',
  row: 0,
  column: 0,
  tabs: [
    { id: 'scene', text: 'SCENE' },
    { id: 'light', text: 'LIGHT' },
  ],
});

const createWindow = (page: string): HudWindow => ({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: DEFAULT_HUD_COLOR,
  closable: true,
  page,
  widgets: [TABS],
});

const THEME = createHud().theme;

const filterFills = (
  paints: readonly OverlayPaint[],
  pixel: number,
): OverlayPaint[] =>
  filter(paints, (paint) =>
    match(paint)
      .with({ pixel }, () => true)
      .otherwise(() => false),
  );

describe('drawHudTabs', () => {
  it('should return the open tab filled with the light face of the theme when it paints the tabs', () => {
    expect(
      filterFills(
        drawHudTabs(createHud(), createWindow('scene'), TABS),
        toPixel(DEFAULT_HUD_COLOR, THEME.face),
      )[0],
    ).toMatchObject(computeTabRects(TABS)[0] ?? {});
  });

  it('should return a closed tab below the open one when it paints the tabs', () => {
    expect(
      filterFills(
        drawHudTabs(createHud(), createWindow('scene'), TABS),
        toPixel(DEFAULT_HUD_COLOR, THEME.body),
      )[0],
    ).toMatchObject({
      row: (computeTabRects(TABS)[1]?.row ?? 0) + HUD_TAB_DROP,
    });
  });

  it('should return a line across the content under the tabs when it paints them', () => {
    expect(
      filterFills(
        drawHudTabs(createHud(), createWindow('scene'), TABS),
        toPixel(DEFAULT_HUD_COLOR, THEME.highlight),
      ),
    ).toContainEqual({
      pixel: toPixel(DEFAULT_HUD_COLOR, THEME.highlight),
      row:
        (computeTabRects(TABS)[0]?.height ?? 0) -
        HUD_EDGE +
        (computeTabRects(TABS)[0]?.row ?? 0),
      column: HUD_CONTENT_LEFT,
      width: computeContentWidth(createWindow('scene')),
      height: HUD_EDGE,
    });
  });

  it('should return no filled tab when no page is open', () => {
    expect(
      filterFills(
        drawHudTabs(createHud(), createWindow(''), TABS),
        toPixel(DEFAULT_HUD_COLOR, THEME.face),
      ),
    ).toEqual([]);
  });

  it('should return the open tab after the line when it paints the tabs, so it covers the line', () => {
    const paints = drawHudTabs(createHud(), createWindow('light'), TABS);

    expect(
      findIndex(paints, (paint) =>
        match(paint)
          .with({ pixel: toPixel(DEFAULT_HUD_COLOR, THEME.face) }, () => true)
          .otherwise(() => false),
      ),
    ).toBeGreaterThan(
      findIndex(paints, (paint) =>
        match(paint)
          .with(
            {
              pixel: toPixel(DEFAULT_HUD_COLOR, THEME.highlight),
              width: computeContentWidth(createWindow('light')),
            },
            () => true,
          )
          .otherwise(() => false),
      ),
    );
  });

  it('should return only the line under the tabs when the strip holds none', () => {
    expect(
      size(
        drawHudTabs(createHud(), createWindow('scene'), { ...TABS, tabs: [] }),
      ),
    ).toBe(LINE_ONLY);
  });
});
