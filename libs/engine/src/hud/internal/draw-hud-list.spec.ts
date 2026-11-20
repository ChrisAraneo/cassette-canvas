import { compact, dropRight, last, map, max, size, times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { toOverlay } from '../../overlay/to-overlay';
import type { OverlayImage } from '../../overlay/types/overlay-image';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { TEXT_INK } from '../../text/consts';
import { toTextPaint } from '../../text/to-text-paint';
import {
  HUD_DOWN_ART,
  HUD_LIST_ITEM_HEIGHT,
  HUD_LIST_TEXT_LEFT,
  HUD_LIST_TEXT_TOP,
  HUD_UP_ART,
} from '../consts';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';
import { computeListLayout } from './compute-list-layout';
import { computeWidgetRect } from './compute-widget-rect';
import { drawHudList } from './draw-hud-list';
import { drawSunken } from './draw-sunken';

const { nonNullable } = P;

const createItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: createItems(6),
  scroll: 0,
  selected: '',
});

const WINDOW: HudWindow = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 90,
  height: 80,
  color: 15,
  closable: true,
  page: '',
  widgets: [LIST],
});

const THEME = createHud().theme;

const TWO_LINE_LIST: HudList = Object.freeze({
  ...LIST,
  items: [
    {
      id: 'neon',
      lines: ['NEON RAIN', '3:42'],
      height: 0,
      widgets: [],
      selectable: true,
    },
  ],
});

const createDraggingHud = (): Hud => ({
  ...createHud(),
  grab: {
    kind: 'SCROLL',
    window: 'deck',
    widget: 'tracks',
    row: 0,
    column: 0,
  },
});

const drawList = (widget: HudList): readonly OverlayPaint[] =>
  drawHudList(createHud(), WINDOW, widget);

const toImages = (paints: readonly OverlayPaint[]): OverlayImage[] =>
  compact(
    map(paints, (paint) =>
      match(paint)
        .with({ image: nonNullable }, (image) => image)
        .otherwise(() => undefined),
    ),
  );

const toDividerLine = (rect: HudRect): OverlayPaint => ({
  pixel: toPixel(THEME.color, THEME.shadow),
  row: rect.row + HUD_LIST_ITEM_HEIGHT,
  column: rect.column,
  width: rect.width,
  height: 1,
});

const toItemRect = (index: number): HudRect | undefined =>
  computeListLayout(LIST).items[index]?.rect;

const toItemText = (index: number, text: string, shade: number): OverlayPaint =>
  toTextPaint(
    text,
    toPixel(THEME.color, shade),
    (toItemRect(index)?.row ?? 0) + HUD_LIST_TEXT_TOP,
    (toItemRect(index)?.column ?? 0) + HUD_LIST_TEXT_LEFT,
  );

const ITEM_WIDTH = 66;

const ARROW_ROW_INSET = 4;

const ARROW_COLUMN_INSET = 3;

const SCROLL_BAR_IMAGES = 2;

const SCROLL_BAR_PAINTS = 18;

describe('drawHudList', () => {
  it('should return a surface sunk into the window under everything when it paints a list', () => {
    expect(drawList(LIST)[0]).toEqual(
      drawSunken(computeWidgetRect(LIST), THEME)[0],
    );
  });

  it('should return one more line of text when the list shows one more item', () => {
    expect(
      size(toImages(drawList(LIST))) -
        size(toImages(drawList({ ...LIST, items: createItems(3) }))),
    ).toBe(1);
  });

  it('should return an item text in the text shade, a row inside the item, when it paints a list', () => {
    expect(drawList(LIST)).toContainEqual(toItemText(0, 'TRACK 0', THEME.text));
  });

  it('should return a divider between each two items it shows when it paints a list', () => {
    const layout = computeListLayout(LIST);

    expect(drawList(LIST)).toEqual(
      expect.arrayContaining(
        map(dropRight(layout.items, 1), (placement) =>
          toDividerLine(placement.rect),
        ),
      ),
    );
  });

  it('should return no divider under the last item it shows when it paints a list', () => {
    const layout = computeListLayout(LIST);

    expect(drawList(LIST)).not.toContainEqual(
      toDividerLine(last(layout.items)?.rect ?? layout.track),
    );
  });

  it('should return the selected item on a dark row when it paints a list', () => {
    expect(drawList({ ...LIST, selected: '1' })).toContainEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      ...computeListLayout(LIST).items[1]?.rect,
    });
  });

  it('should return the selected item in light letters when it paints a list', () => {
    expect(drawList({ ...LIST, selected: '1' })).toContainEqual(
      toItemText(1, 'TRACK 1', THEME.highlight),
    );
  });

  it('should return an item text no wider than the item when the text is too long for it', () => {
    expect(
      max(
        map(
          toImages(
            drawList({
              ...LIST,
              items: [
                {
                  id: 'long',
                  lines: ['A TRACK TITLE THAT RUNS ON AND ON'],
                  height: 0,
                  widgets: [],
                  selectable: true,
                },
              ],
            }),
          ),
          (paint) => paint.image.width,
        ),
      ),
    ).toBeLessThanOrEqual(ITEM_WIDTH - 2 * HUD_LIST_TEXT_LEFT);
  });

  it('should return the thumb of the scroll bar on its track when it paints a list', () => {
    expect(drawList(LIST)).toContainEqual({
      pixel: toPixel(THEME.color, THEME.face),
      ...computeListLayout(LIST).thumb,
    });
  });

  it('should return the up arrow in the middle of its square when it paints a list', () => {
    const up = computeListLayout(LIST).up;

    expect(drawList(LIST)).toContainEqual({
      image: toOverlay(HUD_UP_ART, {
        [TEXT_INK]: toPixel(THEME.color, THEME.text),
      }),
      row: up.row + ARROW_ROW_INSET,
      column: up.column + ARROW_COLUMN_INSET,
    });
  });

  it('should return the down arrow in the middle of its square when it paints a list', () => {
    const down = computeListLayout(LIST).down;

    expect(drawList(LIST)).toContainEqual({
      image: toOverlay(HUD_DOWN_ART, {
        [TEXT_INK]: toPixel(THEME.color, THEME.text),
      }),
      row: down.row + ARROW_ROW_INSET,
      column: down.column + ARROW_COLUMN_INSET,
    });
  });

  it('should return one line of text for each line an item holds when it paints a list', () => {
    expect(
      size(toImages(drawList(TWO_LINE_LIST))) -
        size(toImages(drawList({ ...LIST, items: createItems(1) }))),
    ).toBe(1);
  });

  it('should return the second line of an item one line below the first when it paints a list', () => {
    const rect = computeListLayout(TWO_LINE_LIST).items[0]?.rect;

    expect(drawList(TWO_LINE_LIST)).toContainEqual(
      toTextPaint(
        '3:42',
        toPixel(THEME.color, THEME.text),
        (rect?.row ?? 0) + HUD_LIST_TEXT_TOP + HUD_LIST_ITEM_HEIGHT,
        (rect?.column ?? 0) + HUD_LIST_TEXT_LEFT,
      ),
    );
  });

  it('should return the dark row of a selected item over both of its lines when it paints a list', () => {
    expect(drawList({ ...TWO_LINE_LIST, selected: 'neon' })).toContainEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      ...computeListLayout(TWO_LINE_LIST).items[0]?.rect,
    });
  });

  it('should return no text at all for an item that holds no lines when it paints a list', () => {
    expect(
      size(
        toImages(
          drawList({
            ...LIST,
            items: [
              {
                id: 'blank',
                lines: [],
                height: 0,
                widgets: [],
                selectable: true,
              },
            ],
          }),
        ),
      ),
    ).toBe(SCROLL_BAR_IMAGES);
  });

  it('should return the thumb with the sides of its bevel swapped when the pointer drags it', () => {
    const thumb = computeListLayout(LIST).thumb;

    expect(drawHudList(createDraggingHud(), WINDOW, LIST)).toContainEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: thumb.row,
      column: thumb.column,
      width: thumb.width,
      height: 1,
    });
  });

  it('should return the thumb lit along its top when the pointer holds nothing', () => {
    const thumb = computeListLayout(LIST).thumb;

    expect(drawList(LIST)).toContainEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: thumb.row,
      column: thumb.column,
      width: thumb.width,
      height: 1,
    });
  });

  it('should return the scroll bar and nothing else when the list is empty', () => {
    expect(size(drawList({ ...LIST, items: [] }))).toBe(
      size(drawSunken(computeWidgetRect(LIST), THEME)) + SCROLL_BAR_PAINTS,
    );
  });
});
