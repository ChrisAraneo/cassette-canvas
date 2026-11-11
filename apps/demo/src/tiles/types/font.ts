import type { Tile } from './tile';

/** The tiles of each character a font can draw, keyed by the character. */
export type Font = Readonly<Record<string, readonly Tile[]>>;
