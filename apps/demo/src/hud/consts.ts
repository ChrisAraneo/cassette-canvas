import {
  HUD_CONTENT_TOP,
  HUD_CONTROL_HEIGHT,
  HUD_FRAME,
  HUD_LABEL_PADDING,
  HUD_PADDING,
  type HudTabs,
  type HudWidget,
  type HudWindowSettings,
  measureText,
  TEXT_HEIGHT,
} from '@cassette-canvas/engine';
import { map, max } from 'lodash-es';
import { DAY_LENGTH, HOURS_PER_DAY } from '../day/consts';

export const STREET_WINDOW = 'street';

export const NOTE_WINDOW = 'note';

/** The tabs of the street window, and the pages they open. */
export const TIME_PAGE = 'time';

export const SKY_PAGE = 'sky';

export const PAGES_WIDGET = 'pages';

/** The readouts that change while the demo runs. */
export const FPS_WIDGET = 'fps';

export const CLOCK_WIDGET = 'clock';

export const DARKNESS_WIDGET = 'darkness';

export const SUN_WIDGET = 'sun';

export const HOUR_BUTTON = 'hour';

export const NOW_BUTTON = 'now';

export const DUSK_BUTTON = 'dusk';

export const NOON_BUTTON = 'noon';

export const NOTE_BUTTON = 'open-note';

export const NOTE_FIELD = 'line';

export const NOTE_HINT_WIDGET = 'hint';

export const STREET_TITLE = 'STREET';

export const NOTE_TITLE = 'NOTE';

export const TIME_TAB = 'TIME';

export const SKY_TAB = 'SKY';

export const HOUR_TEXT = '+1 HOUR';

export const NOW_TEXT = 'NOW';

export const DUSK_TEXT = 'DUSK';

export const NOON_TEXT = 'NOON';

export const NOTE_TEXT = 'NOTE...';

export const NOTE_HINT = 'Type a title and press enter.';

export const FPS_LABEL = 'FPS';

export const TIME_LABEL = 'TIME';

export const DARKNESS_LABEL = 'DARK';

export const SUN_LABEL = 'SUN';

/** How far the `+1 HOUR` button moves the clock. */
export const HOUR_LENGTH = DAY_LENGTH / HOURS_PER_DAY;

/** The hours the `DUSK` and the `NOON` button jump to. */
export const DUSK_HOUR = 20;

export const NOON_HOUR = 12;

/** A button or a tab is as wide as its text, with air on both sides. */
const toControlWidth = (text: string): number =>
  measureText(text) + 2 * HUD_LABEL_PADDING;

/** The gap between two controls that sit side by side. */
const CONTROL_GAP = 3;

/** The rows one line of text takes, with air below it. */
const LINE_ROWS = TEXT_HEIGHT + 3;

/** The frame and the air inside it: the margin left, right and below. */
const MARGIN = HUD_FRAME + HUD_PADDING;

/**
 * Where the widgets of the street window sit, measured from the top-left
 * pixel of the window's content: the tabs, two lines of readouts, a row of
 * two buttons, and the button that opens the note window.
 */
const TABS_ROW = 0;

const FIRST_LINE_ROW = HUD_CONTROL_HEIGHT + 5;

const SECOND_LINE_ROW = FIRST_LINE_ROW + LINE_ROWS;

const BUTTON_ROW = SECOND_LINE_ROW + LINE_ROWS + 2;

const NOTE_BUTTON_ROW = BUTTON_ROW + HUD_CONTROL_HEIGHT + CONTROL_GAP;

/** Every button is as wide as the widest of them, so they line up. */
const BUTTON_WIDTH =
  max(map([HOUR_TEXT, NOW_TEXT, DUSK_TEXT, NOON_TEXT], toControlWidth)) ?? 0;

const SECOND_BUTTON_COLUMN = BUTTON_WIDTH + CONTROL_GAP;

/** The widest a readout gets, so the window is wide enough for all of them. */
const STREET_LINES: readonly string[] = Object.freeze([
  `${FPS_LABEL} 999`,
  `${TIME_LABEL} 00:00`,
  `${DARKNESS_LABEL} 100%`,
  `${SUN_LABEL} +0.00`,
]);

const STREET_CONTENT_WIDTH =
  max([
    2 * BUTTON_WIDTH + CONTROL_GAP,
    toControlWidth(TIME_TAB) + toControlWidth(SKY_TAB),
    toControlWidth(NOTE_TEXT),
    ...map(STREET_LINES, measureText),
  ]) ?? 0;

const NOTE_CONTENT_WIDTH = measureText(NOTE_HINT);

const NOTE_FIELD_ROW = LINE_ROWS;

const TABS: HudTabs = Object.freeze({
  kind: 'tabs',
  id: PAGES_WIDGET,
  page: '',
  row: TABS_ROW,
  column: 0,
  tabs: Object.freeze([
    { id: TIME_PAGE, text: TIME_TAB },
    { id: SKY_PAGE, text: SKY_TAB },
  ]),
});

/**
 * What the street window holds. The readouts start out empty: the frame loop
 * fills them with `patchDemoHud` before the first frame is drawn. The tabs
 * and the note button have no page of their own, so they show on both pages.
 */
const STREET_WIDGETS: readonly HudWidget[] = Object.freeze([
  TABS,
  {
    kind: 'label',
    id: FPS_WIDGET,
    page: TIME_PAGE,
    row: FIRST_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'label',
    id: CLOCK_WIDGET,
    page: TIME_PAGE,
    row: SECOND_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'label',
    id: DARKNESS_WIDGET,
    page: SKY_PAGE,
    row: FIRST_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'label',
    id: SUN_WIDGET,
    page: SKY_PAGE,
    row: SECOND_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'button',
    id: HOUR_BUTTON,
    page: TIME_PAGE,
    row: BUTTON_ROW,
    column: 0,
    width: BUTTON_WIDTH,
    text: HOUR_TEXT,
  },
  {
    kind: 'button',
    id: NOW_BUTTON,
    page: TIME_PAGE,
    row: BUTTON_ROW,
    column: SECOND_BUTTON_COLUMN,
    width: BUTTON_WIDTH,
    text: NOW_TEXT,
  },
  {
    kind: 'button',
    id: DUSK_BUTTON,
    page: SKY_PAGE,
    row: BUTTON_ROW,
    column: 0,
    width: BUTTON_WIDTH,
    text: DUSK_TEXT,
  },
  {
    kind: 'button',
    id: NOON_BUTTON,
    page: SKY_PAGE,
    row: BUTTON_ROW,
    column: SECOND_BUTTON_COLUMN,
    width: BUTTON_WIDTH,
    text: NOON_TEXT,
  },
  {
    kind: 'button',
    id: NOTE_BUTTON,
    page: '',
    row: NOTE_BUTTON_ROW,
    column: 0,
    width: STREET_CONTENT_WIDTH,
    text: NOTE_TEXT,
  },
]);

/** What the note window holds: a hint, and a field that takes the keys. */
const NOTE_WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'label',
    id: NOTE_HINT_WIDGET,
    page: '',
    row: 0,
    column: 0,
    text: NOTE_HINT,
  },
  {
    kind: 'input',
    id: NOTE_FIELD,
    page: '',
    row: NOTE_FIELD_ROW,
    column: 0,
    width: NOTE_CONTENT_WIDTH,
    text: '',
  },
]);

/**
 * The window over the street: the frame rate and the clock on one page, the
 * sky on the other. It has no close box, so the demo always keeps one window
 * to drag around.
 */
export const STREET_WINDOW_SETTINGS: HudWindowSettings = Object.freeze({
  id: STREET_WINDOW,
  title: STREET_TITLE,
  row: 8,
  column: 8,
  width: STREET_CONTENT_WIDTH + 2 * MARGIN,
  height: HUD_CONTENT_TOP + NOTE_BUTTON_ROW + HUD_CONTROL_HEIGHT + MARGIN,
  closable: false,
  page: TIME_PAGE,
  widgets: STREET_WIDGETS,
});

/**
 * The window with the field. Its close box takes it off the screen, and the
 * note button on the street window brings it back.
 */
export const NOTE_WINDOW_SETTINGS: HudWindowSettings = Object.freeze({
  id: NOTE_WINDOW,
  title: NOTE_TITLE,
  row: 116,
  column: 160,
  width: NOTE_CONTENT_WIDTH + 2 * MARGIN,
  height: HUD_CONTENT_TOP + NOTE_FIELD_ROW + HUD_CONTROL_HEIGHT + MARGIN,
  closable: true,
  widgets: NOTE_WIDGETS,
});
