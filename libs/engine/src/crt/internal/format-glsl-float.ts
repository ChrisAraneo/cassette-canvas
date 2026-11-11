const GLSL_FLOAT_DIGITS = 4;

export const formatGlslFloat = (value: number): string =>
  value.toFixed(GLSL_FLOAT_DIGITS);
