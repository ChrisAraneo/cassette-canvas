import { COLOR_COUNT, TRANSPARENT } from '@cassette-canvas/engine';
import { SPRITE_SIZE } from '../consts';

export const HUD_WIDTH = 320;

export const HUD_HEIGHT = 72;

/**
 * The HUD has no background, so the page shows between the swatches. Any
 * background color would hide the swatch of the same color.
 */
export const HUD_BACKGROUND = TRANSPARENT;

/** The color chart sits in the middle: one column per color. */
export const SWATCH_TOP = 4;

export const SWATCH_LEFT = (HUD_WIDTH - COLOR_COUNT * SPRITE_SIZE) / 2;

/** The panels on both sides of the chart are as wide as its margin. */
export const PANEL_WIDTH = SWATCH_LEFT;

export const LEFT_PANEL = 0;

export const RIGHT_PANEL = HUD_WIDTH - PANEL_WIDTH;

export const LABEL_ROW = 24;

export const VALUE_ROW = 38;

export const FPS_LABEL = 'FPS';

export const TIME_LABEL = 'TIME';

/** The frame rate shows as up to 3 digits, or as dashes before it is known. */
export const FPS_DIGITS = 3;

export const MAX_FPS = 999;

export const NO_FPS = '--';

/** The clock shows `HH:MM`, in steps of 10 minutes. */
export const CLOCK_LENGTH = 5;

export const CLOCK_STEP = 10;
