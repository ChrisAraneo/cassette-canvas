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
  computeTextAdvance,
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

/** The clock the street starts at, which follows the animation's own time. */
export const START_CLOCK = 0;

const toControlWidth = (text: string): number =>
  computeTextAdvance(text) + 2 * HUD_LABEL_PADDING;

const CONTROL_GAP = 3;

const LINE_GAP = 3;

const TABS_GAP = 5;

const BUTTONS_GAP = 2;

const PANEL_PADDING = 1;

const SCREEN_MARGIN = 8;

const LINE_ROWS = TEXT_HEIGHT + LINE_GAP;

const MARGIN = HUD_FRAME + HUD_PADDING;

const TABS_ROW = 0;

const FIRST_LINE_ROW = HUD_CONTROL_HEIGHT + TABS_GAP;

const SECOND_LINE_ROW = FIRST_LINE_ROW + LINE_ROWS;

const BUTTON_ROW = SECOND_LINE_ROW + LINE_ROWS + BUTTONS_GAP;

const NOTE_BUTTON_ROW = BUTTON_ROW + HUD_CONTROL_HEIGHT + CONTROL_GAP;

const BUTTON_WIDTH =
  max(map([HOUR_TEXT, NOW_TEXT, DUSK_TEXT, NOON_TEXT], toControlWidth)) ?? 0;

const SECOND_BUTTON_COLUMN = BUTTON_WIDTH + CONTROL_GAP;

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
    ...map(STREET_LINES, computeTextAdvance),
  ]) ?? 0;

const NOTE_CONTENT_WIDTH = computeTextAdvance(NOTE_HINT);

const NOTE_FIELD_ROW = LINE_ROWS;

const NOTE_WINDOW_ROW = 128;

const NOTE_WINDOW_COLUMN = 160;

const TABS: HudTabs = Object.freeze({
  kind: 'TABS',
  id: PAGES_WIDGET,
  page: '',
  row: TABS_ROW,
  column: 0,
  tabs: Object.freeze([
    { id: TIME_PAGE, text: TIME_TAB },
    { id: SKY_PAGE, text: SKY_TAB },
  ]),
});

const STREET_WIDGETS: readonly HudWidget[] = Object.freeze([
  TABS,
  {
    kind: 'LABEL',
    id: FPS_WIDGET,
    page: TIME_PAGE,
    row: FIRST_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'LABEL',
    id: CLOCK_WIDGET,
    page: TIME_PAGE,
    row: SECOND_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'LABEL',
    id: DARKNESS_WIDGET,
    page: SKY_PAGE,
    row: FIRST_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'LABEL',
    id: SUN_WIDGET,
    page: SKY_PAGE,
    row: SECOND_LINE_ROW,
    column: 0,
    text: '',
  },
  {
    kind: 'BUTTON',
    id: HOUR_BUTTON,
    page: TIME_PAGE,
    row: BUTTON_ROW,
    column: 0,
    width: BUTTON_WIDTH,
    text: HOUR_TEXT,
  },
  {
    kind: 'BUTTON',
    id: NOW_BUTTON,
    page: TIME_PAGE,
    row: BUTTON_ROW,
    column: SECOND_BUTTON_COLUMN,
    width: BUTTON_WIDTH,
    text: NOW_TEXT,
  },
  {
    kind: 'BUTTON',
    id: DUSK_BUTTON,
    page: SKY_PAGE,
    row: BUTTON_ROW,
    column: 0,
    width: BUTTON_WIDTH,
    text: DUSK_TEXT,
  },
  {
    kind: 'BUTTON',
    id: NOON_BUTTON,
    page: SKY_PAGE,
    row: BUTTON_ROW,
    column: SECOND_BUTTON_COLUMN,
    width: BUTTON_WIDTH,
    text: NOON_TEXT,
  },
  {
    kind: 'BUTTON',
    id: NOTE_BUTTON,
    page: '',
    row: NOTE_BUTTON_ROW,
    column: 0,
    width: STREET_CONTENT_WIDTH,
    text: NOTE_TEXT,
  },
]);

const NOTE_WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'LABEL',
    id: NOTE_HINT_WIDGET,
    page: '',
    row: 0,
    column: 0,
    text: NOTE_HINT,
  },
  {
    kind: 'INPUT',
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
  row: SCREEN_MARGIN,
  column: SCREEN_MARGIN,
  width: STREET_CONTENT_WIDTH + 2 * MARGIN,
  height: HUD_CONTENT_TOP + NOTE_BUTTON_ROW + HUD_CONTROL_HEIGHT + MARGIN,
  closable: false,
  page: TIME_PAGE,
  widgets: STREET_WIDGETS,
});

const TAPE_PANEL_HEIGHT = TEXT_HEIGHT + 2 * (HUD_FRAME + PANEL_PADDING);

const TAPE_LABEL_ROW = HUD_FRAME + PANEL_PADDING;

const TAPE_LABEL_COLUMN = 4;

const TAPE_DIVIDER_ROW = TAPE_PANEL_HEIGHT + CONTROL_GAP;

const TAPE_LIST_ROW = TAPE_DIVIDER_ROW + HUD_DIVIDER_HEIGHT + CONTROL_GAP;

const TAPE_PAGE_TRACKS = 3;

const TRACK_HEIGHT = 2 * HUD_LIST_ITEM_HEIGHT;

const TRACK_PITCH = TRACK_HEIGHT + HUD_DIVIDER_HEIGHT;

const TAPE_LIST_HEIGHT =
  HUD_LIST_ITEM_PITCH +
  TAPE_PAGE_TRACKS * TRACK_PITCH -
  HUD_DIVIDER_HEIGHT +
  2 * HUD_PADDING;

const PLAY_WIDTH = toControlWidth(PLAY_TEXT);

const PLAY_ROW = floor((TRACK_HEIGHT - HUD_CONTROL_HEIGHT) / 2);

const TITLE_WIDTH =
  max(map(TAPE_TRACKS, (track) => computeTextAdvance(track.title))) ?? 0;

const TAPE_CONTENT_WIDTH =
  max([
    HUD_LIST_TEXT_LEFT +
      TITLE_WIDTH +
      CONTROL_GAP +
      PLAY_WIDTH +
      HUD_PADDING +
      HUD_EDGE +
      HUD_LIST_BAR_WIDTH,
    computeTextAdvance(TAPE_HINT) + 2 * TAPE_LABEL_COLUMN,
  ]) ?? 0;

const TRACK_WIDTH =
  TAPE_CONTENT_WIDTH - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH;

const toTrackItem = (track: TapeTrack): HudListItem => ({
  id: track.id,
  lines: [track.title, track.time],
  height: 0,
  widgets: [
    {
      kind: 'BUTTON',
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

const TAPE_WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'PANEL',
    id: TAPE_PANEL,
    page: '',
    row: 0,
    column: 0,
    width: TAPE_CONTENT_WIDTH,
    height: TAPE_PANEL_HEIGHT,
  },
  {
    kind: 'LABEL',
    id: TAPE_LABEL,
    page: '',
    row: TAPE_LABEL_ROW,
    column: TAPE_LABEL_COLUMN,
    text: TAPE_HINT,
  },
  {
    kind: 'DIVIDER',
    id: TAPE_DIVIDER,
    page: '',
    row: TAPE_DIVIDER_ROW,
    column: 0,
    width: TAPE_CONTENT_WIDTH,
  },
  {
    kind: 'LIST',
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
  row: NOTE_WINDOW_ROW,
  column: NOTE_WINDOW_COLUMN,
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
  row: SCREEN_MARGIN,
  column: SCREEN_WIDTH - TAPE_CONTENT_WIDTH - 2 * MARGIN - SCREEN_MARGIN,
  width: TAPE_CONTENT_WIDTH + 2 * MARGIN,
  height: HUD_CONTENT_TOP + TAPE_LIST_ROW + TAPE_LIST_HEIGHT + MARGIN,
  closable: true,
  widgets: TAPE_WIDGETS,
});
