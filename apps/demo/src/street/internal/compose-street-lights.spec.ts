import { filter, find, inRange, map, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  HEADLIGHT,
  LAMP_COLUMNS,
  LAMP_LIGHT,
  LAMPS_ON,
  MOON_GLOW,
  MOON_ID,
  SCREEN_WIDTH,
  SUN_GLOW,
  SUN_ID,
  VEHICLES,
} from '../consts';
import { composeStreetLights } from './compose-street-lights';
import { computeTrackColumn } from './compute-track-column';

const NOON = Object.freeze({ phase: 0.5, darkness: 0 });

const MIDNIGHT = Object.freeze({ phase: 0, darkness: 1 });

const TIME = 7000;

describe('composeStreetLights', () => {
  it('should return only a glow around the sun when it is noon', () => {
    expect(composeStreetLights(NOON, TIME)).toEqual([
      expect.objectContaining({
        id: SUN_ID,
        radius: SUN_GLOW.radius,
        intensity: SUN_GLOW.intensity,
      }),
    ]);
  });

  it('should return a glow around the moon when it is midnight', () => {
    expect(
      find(composeStreetLights(MIDNIGHT, TIME), { id: MOON_ID })?.intensity,
    ).toBe(MOON_GLOW.intensity);
  });

  it('should return no sun light when the sun is below the horizon', () => {
    expect(find(composeStreetLights(MIDNIGHT, TIME), { id: SUN_ID })).toBe(
      undefined,
    );
  });

  it('should return every street lamp at full intensity when it is night', () => {
    expect(
      map(
        filter(composeStreetLights(MIDNIGHT, TIME), ({ id }) =>
          startsWith(id, 'lamp-'),
        ),
        'intensity',
      ),
    ).toEqual(map(LAMP_COLUMNS, () => LAMP_LIGHT.intensity));
  });

  it('should return the street lamps dimmed when dusk is halfway through', () => {
    expect(
      find(
        composeStreetLights(
          { phase: 0.75, darkness: (LAMPS_ON.from + LAMPS_ON.to) / 2 },
          TIME,
        ),
        { id: 'lamp-0' },
      )?.intensity,
    ).toBeCloseTo(LAMP_LIGHT.intensity / 2);
  });

  it('should return a headlight in front of every car on the screen when it is night', () => {
    expect(
      map(
        filter(composeStreetLights(MIDNIGHT, TIME), ({ id }) =>
          startsWith(id, 'car-'),
        ),
        'id',
      ),
    ).toEqual(
      map(
        filter(VEHICLES, (vehicle) =>
          inRange(
            computeTrackColumn(vehicle, TIME) + vehicle.headlight.column,
            -HEADLIGHT.radius,
            SCREEN_WIDTH + HEADLIGHT.radius,
          ),
        ),
        ({ id }) => `${id}-headlight`,
      ),
    );
  });

  it('should return no lamp and no headlight lights when it is daylight', () => {
    expect(size(composeStreetLights(NOON, TIME))).toBe(1);
  });
});
