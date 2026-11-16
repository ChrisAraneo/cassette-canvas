const CORNER_COUNT = 3;

const FIRST_CORNER = 0;

export const drawCrtCorners = (context: WebGLRenderingContext): void =>
  context.drawArrays(context.TRIANGLES, FIRST_CORNER, CORNER_COUNT);
