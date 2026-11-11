/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import type { Light } from '../../screen/types/light';
import type { Lighting } from '../types/lighting';

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline, this ring sweep
// took 8.84 ms per frame for two lights (7,919 cells) on a 192x128 screen
// (Vite bundle, Node 24). This loop takes 0.43 ms. On the demo screen
// (320x180, two lights), reading the shadow casters from a Uint8Array instead
// of a record, and Math.sqrt instead of Math.hypot, took it from 0.48 ms to
// 0.21 ms. It only changes typed arrays it creates itself, and they do not
// change after it returns them.
export const computeLightField = (
  { width, height, occluders }: Lighting,
  light: Light,
): Float32Array => {
  const field = new Float32Array(width * height);
  const visible = new Uint8Array(width * height);
  const lightRow = Math.floor(light.row);
  const lightColumn = Math.floor(light.column);
  const reach = Math.ceil(light.radius);
  const firstRing = Math.max(
    0,
    -lightRow,
    lightRow - (height - 1),
    -lightColumn,
    lightColumn - (width - 1),
  );

  for (let ring = firstRing; ring <= reach; ring += 1) {
    const top = Math.max(-ring, -lightRow);
    const bottom = Math.min(ring, height - 1 - lightRow);

    for (let rowOffset = top; rowOffset <= bottom; rowOffset += 1) {
      const isEdgeRow = rowOffset === -ring || rowOffset === ring;
      const left = isEdgeRow ? Math.max(-ring, -lightColumn) : -ring;
      const right = isEdgeRow ? Math.min(ring, width - 1 - lightColumn) : ring;
      const step = isEdgeRow ? 1 : 2 * ring;

      for (
        let columnOffset = left;
        columnOffset <= right;
        columnOffset += step
      ) {
        const row = lightRow + rowOffset;
        const column = lightColumn + columnOffset;

        if (column < 0 || column >= width) {
          continue;
        }

        const parentRow =
          lightRow + Math.round((rowOffset * (ring - 1)) / ring);
        const parentColumn =
          lightColumn + Math.round((columnOffset * (ring - 1)) / ring);
        const parentIndex = parentRow * width + parentColumn;
        const hasParent =
          ring >= 2 &&
          parentRow >= 0 &&
          parentRow < height &&
          parentColumn >= 0 &&
          parentColumn < width;
        const isVisible =
          !hasParent ||
          (visible[parentIndex] === 1 && occluders[parentIndex] !== 1);
        const index = row * width + column;
        const distance = Math.sqrt(
          rowOffset * rowOffset + columnOffset * columnOffset,
        );

        visible[index] = isVisible ? 1 : 0;

        if (isVisible && distance < light.radius) {
          field[index] = light.intensity * (1 - distance / light.radius);
        }
      }
    }
  }

  return field;
};
