import {
  type Display,
  drawScreen,
  type Screen,
  tryCreateDisplay,
} from '@cassette-canvas/engine';
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { DEMO_SETTINGS } from './scene/consts';
import { createDemoScreen } from './scene/create-demo-screen';
import { patchDemoScreen } from './scene/patch-demo-screen';

const { instanceOf, nonNullable } = P;

const handleFrame = (display: Display, screen: Screen, time: number): number =>
  pipe(
    patchDemoScreen(screen, time),
    (frameScreen) => drawScreen(display, frameScreen, time),
    (drawn) =>
      requestAnimationFrame((nextTime) => handleFrame(drawn, screen, nextTime)),
  );

const startDemo = (canvas: HTMLCanvasElement): number | undefined =>
  match(tryCreateDisplay(canvas, DEMO_SETTINGS))
    .with(nonNullable, (display) =>
      requestAnimationFrame((time) =>
        handleFrame(display, createDemoScreen(), time),
      ),
    )
    .otherwise(() => undefined);

match(document.getElementById('screen'))
  .with(instanceOf(HTMLCanvasElement), startDemo)
  .otherwise(noop);
