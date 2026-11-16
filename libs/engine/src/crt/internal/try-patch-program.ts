import { pipe } from 'remeda';
import { runProgramLinker } from './run-program-linker';
import { tryGetLinkedProgram } from './try-get-linked-program';
import { writePositionLocation } from './write-position-location';
import { writeProgramShader } from './write-program-shader';

export const tryPatchProgram = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | undefined =>
  pipe(
    program,
    (created) => writeProgramShader(context, created, vertexShader),
    (attached) => writeProgramShader(context, attached, fragmentShader),
    (attached) => writePositionLocation(context, attached),
    (bound) => runProgramLinker(context, bound),
    (linked) => tryGetLinkedProgram(context, linked),
  );
