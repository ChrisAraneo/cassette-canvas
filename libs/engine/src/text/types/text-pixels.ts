/**
 * What a line of text is drawn in: one pixel value for the whole line, or
 * one pixel value per character, so a single line can hold more than one
 * color. A character past the end of a list takes the last pixel in it, and
 * an empty list draws nothing.
 */
export type TextPixels = number | readonly number[];
