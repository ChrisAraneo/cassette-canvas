import { TEXT_HEIGHT } from '../text/consts';

/**
 * The base color of a HUD, as a palette color index. In the palette the demo
 * builds, color 15 is the sand color, the closest one to beige.
 */
export const DEFAULT_HUD_COLOR = 15;

/**
 * The shades of the base color a HUD is drawn in. A HUD is monochrome: one
 * color, eight shades, so it looks like one surface whatever the scene below
 * it does.
 *
 * - `HUD_EDGE_SHADE` the dark line around a window, a field, and the frame
 * - `HUD_SHADOW_SHADE` the side of a bevel that faces away from the light
 * - `HUD_TITLE_SHADE` the title bar
 * - `HUD_BODY_SHADE` the window behind the controls
 * - `HUD_FACE_SHADE` buttons and tabs, lighter than the window
 * - `HUD_HIGHLIGHT_SHADE` the lit side of a bevel, and the inside of a field
 * - `HUD_TEXT_SHADE` every letter
 */
export const HUD_EDGE_SHADE = 1;

export const HUD_SHADOW_SHADE = 3;

export const HUD_TITLE_SHADE = 4;

export const HUD_BODY_SHADE = 5;

export const HUD_FACE_SHADE = 6;

export const HUD_HIGHLIGHT_SHADE = 7;

export const HUD_TEXT_SHADE = 1;

/** The dark line around a window. */
export const HUD_EDGE = 1;

/** The raised bevel inside that line. */
export const HUD_BEVEL = 1;

/** The rows and columns a window frame takes on each side. */
export const HUD_FRAME = HUD_EDGE + HUD_BEVEL;

/** The height of the title bar, and of a button, a field, and a tab. */
export const HUD_TITLE_HEIGHT = 12;

export const HUD_CONTROL_HEIGHT = 12;

/** The gap between the frame and what sits inside it. */
export const HUD_PADDING = 2;

/** Where a window's widgets start, measured from its top-left pixel. */
export const HUD_CONTENT_TOP = HUD_FRAME + HUD_TITLE_HEIGHT + HUD_PADDING;

export const HUD_CONTENT_LEFT = HUD_FRAME + HUD_PADDING;

/** The columns left of and right of the text on a button or a tab. */
export const HUD_LABEL_PADDING = 4;

/** The top of a capital letter inside a title bar, a button, or a field. */
export const HUD_TEXT_TOP = 2;

/** The close box is square, with one pixel of padding inside the title bar. */
export const HUD_CLOSE_SIZE = HUD_TITLE_HEIGHT - 2;

export const HUD_CLOSE_MARGIN = 1;

/** How far a pressed button and its text move down and right. */
export const HUD_PRESS_SHIFT = 1;

/** The caret of the focused field. */
export const HUD_CARET_WIDTH = 1;

export const HUD_CARET_HEIGHT = TEXT_HEIGHT;

/** How much a tab that is not open sits below the open one. */
export const HUD_TAB_DROP = 2;

/** The id each window gets as an overlay: this, a dash, and the window id. */
export const HUD_OVERLAY_PREFIX = 'hud';

/** The X in the close box. */
export const HUD_CLOSE_ART: readonly string[] = Object.freeze([
  '#...#',
  '.#.#.',
  '..#..',
  '.#.#.',
  '#...#',
]);

/** The key that clears the focus, and the keys a field reads. */
export const HUD_BACKSPACE_KEY = 'Backspace';

export const HUD_ENTER_KEY = 'Enter';

export const HUD_ESCAPE_KEY = 'Escape';
