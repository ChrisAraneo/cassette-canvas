/**
 * A sprite: `spriteSize * spriteSize` pixel values, row by row from the top
 * left. Each value is a pixel such as `0x35` (color 3, shade 5) or
 * `TRANSPARENT`.
 */
export type Sprite = readonly number[];
