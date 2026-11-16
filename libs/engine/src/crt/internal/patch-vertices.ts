import { pipe } from 'remeda';
import { writeVerticesBinding } from './write-vertices-binding';
import { writeVerticesData } from './write-vertices-data';

export const patchVertices = (
  context: WebGLRenderingContext,
  vertices: WebGLBuffer,
): WebGLBuffer =>
  pipe(
    vertices,
    (created) => writeVerticesBinding(context, created),
    (bound) => writeVerticesData(context, bound),
  );
