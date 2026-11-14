import { filter, findIndex } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import { HUD_CONTENT_LEFT, HUD_TAB_DROP } from '../consts';
import type { HudTabs } from '../types/hud-tabs';
import type { HudWindow } from '../types/hud-window';
import { computeContentWidth } from './compute-content-width';
import { computeTabRects } from './compute-tab-rects';
import { paintHudTabs } from './paint-hud-tabs';

const TABS: HudTabs = Object.freeze({
  kind: 'tabs',
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
  color: 15,
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

describe('paintHudTabs', () => {
  it('should return the open tab filled with the light face of the theme when it paints the tabs', () => {
    expect(
      filterFills(
        paintHudTabs(createHud(), createWindow('scene'), TABS),
        toPixel(15, THEME.face),
      )[0],
    ).toMatchObject(computeTabRects(TABS)[0] ?? {});
  });

  it('should return a closed tab below the open one when it paints the tabs', () => {
    expect(
      filterFills(
        paintHudTabs(createHud(), createWindow('scene'), TABS),
        toPixel(15, THEME.body),
      )[0],
    ).toMatchObject({
      row: (computeTabRects(TABS)[1]?.row ?? 0) + HUD_TAB_DROP,
    });
  });

  it('should return a line across the content under the tabs when it paints them', () => {
    expect(
      filterFills(
        paintHudTabs(createHud(), createWindow('scene'), TABS),
        toPixel(15, THEME.highlight),
      ),
    ).toContainEqual({
      pixel: toPixel(15, THEME.highlight),
      row:
        (computeTabRects(TABS)[0]?.height ?? 0) -
        1 +
        (computeTabRects(TABS)[0]?.row ?? 0),
      column: HUD_CONTENT_LEFT,
      width: computeContentWidth(createWindow('scene')),
      height: 1,
    });
  });

  it('should return no filled tab when no page is open', () => {
    expect(
      filterFills(
        paintHudTabs(createHud(), createWindow(''), TABS),
        toPixel(15, THEME.face),
      ),
    ).toEqual([]);
  });

  it('should return the open tab after the line when it paints the tabs, so it covers the line', () => {
    const paints = paintHudTabs(createHud(), createWindow('light'), TABS);

    expect(
      findIndex(paints, (paint) =>
        match(paint)
          .with({ pixel: toPixel(15, THEME.face) }, () => true)
          .otherwise(() => false),
      ),
    ).toBeGreaterThan(
      findIndex(paints, (paint) =>
        match(paint)
          .with(
            {
              pixel: toPixel(15, THEME.highlight),
              width: computeContentWidth(createWindow('light')),
            },
            () => true,
          )
          .otherwise(() => false),
      ),
    );
  });
});
