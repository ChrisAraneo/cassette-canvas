import {
  HUD_CONTENT_TOP,
  HUD_CONTROL_HEIGHT,
  HUD_DIVIDER_HEIGHT,
  HUD_EDGE,
  HUD_FRAME,
  HUD_LABEL_PADDING,
  HUD_LIST_BAR_WIDTH,
  HUD_LIST_ITEM_HEIGHT,
  HUD_LIST_ITEM_PITCH,
  HUD_LIST_TEXT_LEFT,
  HUD_PADDING,
  type HudListItem,
  type HudTabs,
  type HudWidget,
  type HudWindowSettings,
  measureText,
  TEXT_BOLT,
  TEXT_HEART,
  TEXT_HEIGHT,
} from '@cassette-canvas/engine';
import { floor, map, max } from 'lodash-es';
import { DAY_LENGTH, HOURS_PER_DAY } from '../day/consts';
import { SCREEN_WIDTH } from '../street/consts';
import type { TapeTrack } from './types/tape-track';

export const STREET_WINDOW = 'street';

export const NOTE_WINDOW = 'note';

export const TAPE_WINDOW = 'tape';

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

/** What the tape window holds: a readout on a panel over the track list. */
export const TAPE_PANEL = 'readout';

export const TAPE_LABEL = 'playing';

export const TAPE_DIVIDER = 'line';

export const TAPE_LIST = 'tracks';

export const STREET_TITLE = 'STREET';

export const NOTE_TITLE = 'NOTE';

export const TAPE_TITLE = 'TAPE';

export const TIME_TAB = 'TIME';

export const SKY_TAB = 'SKY';

export const HOUR_TEXT = '+1 HOUR';

export const NOW_TEXT = 'NOW';

export const DUSK_TEXT = 'DUSK';

export const NOON_TEXT = 'NOON';

export const NOTE_TEXT = 'NOTE...';

export const NOTE_HINT = 'Type a title and press enter.';

/** What the tape readout shows until a track is picked. */
export const TAPE_HINT = `${TEXT_BOLT} PICK A TRACK`;

/** The heading over the tracks, which takes no selection of its own. */
export const TAPE_HEADING = 'side-a';

export const TAPE_HEADING_TEXT = 'SIDE A';

/** The play button on a track: this, a dash, and the track's id. */
export const PLAY_BUTTON = 'play';

export const PLAY_TEXT = 'PLAY';

/** The tracks on the tape, two of them with a glyph of their own. */
export const TAPE_TRACKS: readonly TapeTrack[] = Object.freeze([
  { id: 'neon', title: 'NEON RAIN', time: '3:42' },
  { id: 'deck', title: 'CASSETTE DECK', time: '2:58' },
  { id: 'power', title: `POWER ${TEXT_BOLT}`, time: '4:11' },
  { id: 'heart', title: `SLOW HEART ${TEXT_HEART}`, time: '5:03' },
  { id: 'bus', title: 'MIDNIGHT BUS', time: '3:27' },
  { id: 'ghost', title: 'RADIO GHOST', time: '6:14' },
  { id: 'exit', title: 'LAST EXIT', time: '2:45' },
]);

export const FPS_LABEL = 'FPS';

export const TIME_LABEL = 'TIME';

export const DARKNESS_LABEL = 'DARK';

export const SUN_LABEL = 'SUN';

/** How far the `+1 HOUR` button moves the clock. */
export const HOUR_LENGTH = DAY_LENGTH / HOURS_PER_DAY;

/** The hours the `DUSK` and the `NOON` button jump to. */
export const DUSK_HOUR = 20;

export const NOON_HOUR = 12;

/**
 * Returns how wide a button or a tab is: its text, with padding on both
 * sides.
 */
const toControlWidth = (text: string): number =>
  measureText(text) + 2 * HUD_LABEL_PADDING;

/** The gap between two controls that sit side by side. */
const CONTROL_GAP = 3;

/** The rows one line of text takes, with a blank row below it. */
const LINE_ROWS = TEXT_HEIGHT + 3;

/** The frame and the padding inside it: the margin left, right, and below. */
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

/** What the note window holds: a hint, and a field that reads the keys. */
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
 * Where the widgets of the tape window sit: the readout on its panel, the
 * divider under it, and the list of tracks below that. The list shows its
 * heading and three tracks at a time, so the rest scroll into view.
 */
const TAPE_PANEL_HEIGHT = TEXT_HEIGHT + 2 * (HUD_FRAME + 1);

const TAPE_LABEL_ROW = HUD_FRAME + 1;

const TAPE_LABEL_COLUMN = 4;

const TAPE_DIVIDER_ROW = TAPE_PANEL_HEIGHT + CONTROL_GAP;

const TAPE_LIST_ROW = TAPE_DIVIDER_ROW + HUD_DIVIDER_HEIGHT + CONTROL_GAP;

const TAPE_PAGE_TRACKS = 3;

/** A track takes two lines: its title, and how long it runs. */
const TRACK_HEIGHT = 2 * HUD_LIST_ITEM_HEIGHT;

const TRACK_PITCH = TRACK_HEIGHT + HUD_DIVIDER_HEIGHT;

/** The heading and three tracks, with a divider between each two. */
const TAPE_LIST_HEIGHT =
  HUD_LIST_ITEM_PITCH +
  TAPE_PAGE_TRACKS * TRACK_PITCH -
  HUD_DIVIDER_HEIGHT +
  2 * HUD_PADDING;

const PLAY_WIDTH = toControlWidth(PLAY_TEXT);

/** The play button sits in the middle of the two lines of its track. */
const PLAY_ROW = floor((TRACK_HEIGHT - HUD_CONTROL_HEIGHT) / 2);

const TITLE_WIDTH =
  max(map(TAPE_TRACKS, (track) => measureText(track.title))) ?? 0;

/**
 * The widest the tape window gets: the longest title with the play button
 * beside it and room for the scroll bar, or the hint in the readout,
 * whichever asks for more.
 */
const TAPE_CONTENT_WIDTH =
  max([
    HUD_LIST_TEXT_LEFT +
      TITLE_WIDTH +
      CONTROL_GAP +
      PLAY_WIDTH +
      HUD_PADDING +
      HUD_EDGE +
      HUD_LIST_BAR_WIDTH,
    measureText(TAPE_HINT) + 2 * TAPE_LABEL_COLUMN,
  ]) ?? 0;

/**
 * The columns one item of the list takes: the list without the padding down
 * its left side, the dark line down its right side, and the scroll bar
 * inside that line. The play button ends where the item does.
 */
const TRACK_WIDTH =
  TAPE_CONTENT_WIDTH - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH;

/** One track of the tape as an item of the list: two lines and a button. */
const toTrackItem = (track: TapeTrack): HudListItem => ({
  id: track.id,
  lines: [track.title, track.time],
  height: 0,
  widgets: [
    {
      kind: 'button',
      id: `${PLAY_BUTTON}-${track.id}`,
      page: '',
      row: PLAY_ROW,
      column: TRACK_WIDTH - PLAY_WIDTH,
      width: PLAY_WIDTH,
      text: PLAY_TEXT,
    },
  ],
  selectable: true,
});

/**
 * What the track list holds: a heading that cannot be selected, and one item
 * for each track, two lines tall and with a play button of its own.
 */
const TAPE_ITEMS: readonly HudListItem[] = Object.freeze([
  {
    id: TAPE_HEADING,
    lines: [TAPE_HEADING_TEXT],
    height: 0,
    widgets: [],
    selectable: false,
  },
  ...map(TAPE_TRACKS, toTrackItem),
]);

/**
 * What the tape window holds: a panel with the readout on it, a divider, and
 * the list of tracks. The panel comes first, so the readout is painted on
 * top of it.
 */
const TAPE_WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'panel',
    id: TAPE_PANEL,
    page: '',
    row: 0,
    column: 0,
    width: TAPE_CONTENT_WIDTH,
    height: TAPE_PANEL_HEIGHT,
  },
  {
    kind: 'label',
    id: TAPE_LABEL,
    page: '',
    row: TAPE_LABEL_ROW,
    column: TAPE_LABEL_COLUMN,
    text: TAPE_HINT,
  },
  {
    kind: 'divider',
    id: TAPE_DIVIDER,
    page: '',
    row: TAPE_DIVIDER_ROW,
    column: 0,
    width: TAPE_CONTENT_WIDTH,
  },
  {
    kind: 'list',
    id: TAPE_LIST,
    page: '',
    row: TAPE_LIST_ROW,
    column: 0,
    width: TAPE_CONTENT_WIDTH,
    height: TAPE_LIST_HEIGHT,
    items: TAPE_ITEMS,
    scroll: 0,
    selected: '',
  },
]);

/**
 * The window with the field. Its close box takes it off the screen, and the
 * note button on the street window brings it back. It sits below the tape
 * window, so all three windows start out clear of each other.
 */
export const NOTE_WINDOW_SETTINGS: HudWindowSettings = Object.freeze({
  id: NOTE_WINDOW,
  title: NOTE_TITLE,
  row: 128,
  column: 160,
  width: NOTE_CONTENT_WIDTH + 2 * MARGIN,
  height: HUD_CONTENT_TOP + NOTE_FIELD_ROW + HUD_CONTROL_HEIGHT + MARGIN,
  closable: true,
  widgets: NOTE_WIDGETS,
});

/**
 * The window with the track list, up in the top right corner of the screen.
 * Pressing a track writes it into the readout on the panel above the list,
 * and the arrows beside the tracks scroll the ones that do not fit.
 */
export const TAPE_WINDOW_SETTINGS: HudWindowSettings = Object.freeze({
  id: TAPE_WINDOW,
  title: TAPE_TITLE,
  row: 8,
  column: SCREEN_WIDTH - TAPE_CONTENT_WIDTH - 2 * MARGIN - 8,
  width: TAPE_CONTENT_WIDTH + 2 * MARGIN,
  height: HUD_CONTENT_TOP + TAPE_LIST_ROW + TAPE_LIST_HEIGHT + MARGIN,
  closable: true,
  widgets: TAPE_WIDGETS,
});
