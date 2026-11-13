import { COLOR_COUNT, TRANSPARENT } from '@cassette-canvas/engine';
import { SPRITE_SIZE } from '../consts';

export const CHART_WIDTH = 320;

export const CHART_HEIGHT = 72;

/**
 * The chart has no background, so the page shows between the swatches. Any
 * background color would hide the swatch of the same color.
 */
export const CHART_BACKGROUND = TRANSPARENT;

/** The color chart sits in the middle: one column per color. */
export const SWATCH_TOP = 4;

export const SWATCH_LEFT = (CHART_WIDTH - COLOR_COUNT * SPRITE_SIZE) / 2;

/** The panels on both sides of the chart are as wide as its margin. */
export const PANEL_WIDTH = SWATCH_LEFT;

export const LEFT_PANEL = 0;

export const RIGHT_PANEL = CHART_WIDTH - PANEL_WIDTH;

export const LABEL_ROW = 24;

export const VALUE_ROW = 38;

export const FPS_LABEL = 'FPS';

export const TIME_LABEL = 'TIME';
