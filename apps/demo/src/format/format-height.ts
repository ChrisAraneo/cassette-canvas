import { match } from 'ts-pattern';
import { HEIGHT_DECIMALS } from './consts';

const toSign = (height: number): string =>
  match(height < 0)
    .with(true, () => '-')
    .otherwise(() => '+');

/**
 * Formats a height (-1 to 1) with its sign and `HEIGHT_DECIMALS` decimals,
 * as in `+0.63`, so the text keeps its width as the number moves.
 */
export const formatHeight = (height: number): string =>
  `${toSign(height)}${Math.abs(height).toFixed(HEIGHT_DECIMALS)}`;
