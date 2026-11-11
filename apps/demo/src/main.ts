import { drawScreen, tryCreateDisplay } from '@cassette-canvas/engine';
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { DEMO_SETTINGS } from './consts';
import { createFpsMeter } from './fps/create-fps-meter';
import { patchFpsMeter } from './fps/patch-fps-meter';
import { composeHudScreen } from './hud/compose-hud-screen';
import { createHudScenery } from './hud/create-hud-scenery';
import { composeStreetScreen } from './street/compose-street-screen';
import { createStreetScenery } from './street/create-street-scenery';
import type { Demo } from './types/demo';

const { instanceOf, nonNullable } = P;

const drawDemo = (demo: Demo, time: number): Demo => ({
  ...demo,
  street: drawScreen(
    demo.street,
    composeStreetScreen(demo.streetScenery, time),
    time,
  ),
  hud: drawScreen(
    demo.hud,
    composeHudScreen(demo.hudScenery, demo.meter.fps, time),
    time,
  ),
});

const handleFrame = (demo: Demo, time: number): number =>
  pipe(
    { ...demo, meter: patchFpsMeter(demo.meter, time) },
    (measured) => drawDemo(measured, time),
    (drawn) =>
      requestAnimationFrame((nextTime) => handleFrame(drawn, nextTime)),
  );

const startDemo = (
  streetCanvas: HTMLCanvasElement,
  hudCanvas: HTMLCanvasElement,
): number | undefined =>
  match({
    street: tryCreateDisplay(streetCanvas, DEMO_SETTINGS),
    hud: tryCreateDisplay(hudCanvas, DEMO_SETTINGS),
  })
    .with({ street: nonNullable, hud: nonNullable }, ({ street, hud }) =>
      requestAnimationFrame((time) =>
        handleFrame(
          {
            street,
            hud,
            streetScenery: createStreetScenery(),
            hudScenery: createHudScenery(),
            meter: createFpsMeter(time),
          },
          time,
        ),
      ),
    )
    .otherwise(() => undefined);

match([document.getElementById('street'), document.getElementById('hud')])
  .with(
    [instanceOf(HTMLCanvasElement), instanceOf(HTMLCanvasElement)],
    ([street, hud]) => startDemo(street, hud),
  )
  .otherwise(noop);
