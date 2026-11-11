import { round } from 'lodash-es';
import { FULL_TURN } from '../../day/consts';
import {
  HORIZON_ROW,
  ORBIT_CENTER,
  ORBIT_HEIGHT,
  ORBIT_WIDTH,
} from '../consts';
import type { Orb } from '../types/orb';

const NOON = 0.5;

const toOrb = (angle: number): Orb => ({
  row: round(HORIZON_ROW - Math.cos(angle) * ORBIT_HEIGHT),
  column: round(ORBIT_CENTER + Math.sin(angle) * ORBIT_WIDTH),
  height: Math.cos(angle),
});

/**
 * Returns where the sun is at a time of day: it rises on the left at 6:00,
 * is highest at noon and sets on the right at 18:00. Pass the phase plus a
 * half to get the moon, which is always on the other side.
 */
export const computeOrb = (phase: number): Orb =>
  toOrb(FULL_TURN * (phase - NOON));
