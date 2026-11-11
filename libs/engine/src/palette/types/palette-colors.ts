import type { HexColor } from './hex-color';

/** Exactly 16 base colors. The first is color 0, the last is color 15. */
export type PaletteColors = readonly [
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
  HexColor,
];
