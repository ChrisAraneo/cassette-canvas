/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import type { Light } from '../../screen/types/light';
import { REFERENCE_EXPOSURE, SHADOW_SOFTNESS } from '../consts';
import type { Lighting } from '../types/lighting';
import { computeFalloff } from './compute-falloff';
import { toExposure } from './to-exposure';

const SHARE_AHEAD = 1 - 2 * SHADOW_SOFTNESS;

/**
 * Returns how much light one light adds to every pixel. The values are
 * amounts of light, not extended shades, because that is what adds up:
 * `computeShadeOffsets` sums the amounts and reads the shades off them.
 *
 * At its center the light adds as much light as its intensity stands for,
 * which thins out to nothing at its radius. Sprites that cast shadows block
 * it, and the edge of a shadow ramps down over two pixels rather than
 * stepping down in one. A negative intensity takes light away instead.
 */
// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline, this ring sweep took 8.84 ms per frame for two lights
// (7,919 cells) on a 192x128 screen (Vite bundle, Node 24); as a loop,
// 0.43 ms. Reading the shadow casters from a Uint8Array instead of a record
// cut it further. It compares squared distances, so it needs no square root
// and the falloff comes for free: on the demo screen at night (320x180, 11
// lights) it takes 1.4 ms per frame, where the straight-line falloff and the
// hard shadow edges it replaces took 1.26 ms. Reading the two pixels beside
// the one ahead, rather than carrying a soft share outward from the light,
// keeps that to 0.14 ms and keeps a shadow from fading out as it lengthens.
// It only changes typed arrays it creates itself, and they do not change
// after it returns them.
export const computeLightExposure = (
  { width, height, occluders }: Lighting,
  light: Light,
): Float32Array => {
  const exposures = new Float32Array(width * height);
  const visible = new Uint8Array(width * height);
  const lightRow = Math.floor(light.row);
  const lightColumn = Math.floor(light.column);
  const reach = Math.ceil(light.radius);
  const squaredRadius = light.radius * light.radius;
  const emission = toExposure(light.intensity) - REFERENCE_EXPOSURE;
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
    const sideReach = ring - 1;

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

        const parentRowOffset = Math.round((rowOffset * sideReach) / ring);
        const parentColumnOffset = Math.round(
          (columnOffset * sideReach) / ring,
        );
        const parentRow = lightRow + parentRowOffset;
        const parentColumn = lightColumn + parentColumnOffset;
        const parentIndex = parentRow * width + parentColumn;
        const hasParent =
          ring >= 2 &&
          parentRow >= 0 &&
          parentRow < height &&
          parentColumn >= 0 &&
          parentColumn < width;
        const litAhead =
          !hasParent ||
          (visible[parentIndex] === 1 && occluders[parentIndex] !== 1)
            ? 1
            : 0;

        // The two pixels beside the one ahead, along the ring it sits on.
        // Past a corner of that ring, or off the screen, they fall back to
        // the pixel ahead, so this only ever reads rings already swept.
        const runsAlongRow =
          Math.abs(parentRowOffset) >= Math.abs(parentColumnOffset);
        const sideStep = runsAlongRow ? 1 : width;
        const sideOffset = runsAlongRow ? parentColumnOffset : parentRowOffset;
        const sidePlace = runsAlongRow ? parentColumn : parentRow;
        const sideLimit = runsAlongRow ? width : height;
        const lowIndex = parentIndex - sideStep;
        const highIndex = parentIndex + sideStep;
        const litLow =
          hasParent && sideOffset > -sideReach && sidePlace > 0
            ? visible[lowIndex] === 1 && occluders[lowIndex] !== 1
              ? 1
              : 0
            : litAhead;
        const litHigh =
          hasParent && sideOffset < sideReach && sidePlace < sideLimit - 1
            ? visible[highIndex] === 1 && occluders[highIndex] !== 1
              ? 1
              : 0
            : litAhead;
        const share =
          SHARE_AHEAD * litAhead + SHADOW_SOFTNESS * (litLow + litHigh);
        const index = row * width + column;
        const squaredDistance =
          rowOffset * rowOffset + columnOffset * columnOffset;

        visible[index] = litAhead;

        if (share > 0 && squaredDistance < squaredRadius) {
          exposures[index] =
            emission * share * computeFalloff(squaredDistance / squaredRadius);
        }
      }
    }
  }

  return exposures;
};
