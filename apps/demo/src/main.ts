import {
  addHud,
  type Display,
  drawScreen,
  tryCreateDisplay,
} from '@cassette-canvas/engine';
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { composeChartScreen } from './chart/compose-chart-screen';
import { createChartScenery } from './chart/create-chart-scenery';
import { DEMO_SETTINGS, PIXEL_SIZE } from './consts';
import { computeDayCycle } from './day/compute-day-cycle';
import { createFpsMeter } from './fps/create-fps-meter';
import { patchFpsMeter } from './fps/patch-fps-meter';
import { applyHudEvents } from './hud/apply-hud-events';
import { createDemoHud } from './hud/create-demo-hud';
import { patchDemoHud } from './hud/patch-demo-hud';
import { createInputMailbox } from './input/create-input-mailbox';
import { listenToKeys } from './input/listen-to-keys';
import { listenToPointer } from './input/listen-to-pointer';
import type { InputMailbox } from './input/types/input-mailbox';
import { composeStreetScreen } from './street/compose-street-screen';
import { createStreetScenery } from './street/create-street-scenery';
import type { Demo } from './types/demo';

const { instanceOf, nonNullable } = P;

/** The scene runs `clock` milliseconds ahead of the animation. */
const toSceneTime = (demo: Demo, time: number): number => time + demo.clock;

/** The HUD goes on the street screen, where no light reaches it. */
const drawStreet = (demo: Demo, time: number): Display =>
  drawScreen(
    demo.street,
    addHud(
      composeStreetScreen(demo.streetScenery, toSceneTime(demo, time)),
      demo.hud,
    ),
    time,
  );

const drawChart = (demo: Demo, time: number): Display =>
  drawScreen(
    demo.chart,
    composeChartScreen(
      demo.chartScenery,
      demo.meter.fps,
      toSceneTime(demo, time),
    ),
    time,
  );

const drawDemo = (demo: Demo, time: number): Demo =>
  pipe(
    patchDemoHud(
      demo.hud,
      demo.meter.fps,
      computeDayCycle(toSceneTime(demo, time)),
    ),
    (hud) => ({ ...demo, hud }),
    (patched) => ({
      ...patched,
      street: drawStreet(patched, time),
      chart: drawChart(patched, time),
    }),
  );

const answerInput = (
  demo: Demo,
  mailbox: InputMailbox,
  time: number,
): Demo => ({
  ...demo,
  ...applyHudEvents(
    { hud: demo.hud, clock: demo.clock },
    mailbox.drain(),
    time,
  ),
});

const handleFrame = (demo: Demo, mailbox: InputMailbox, time: number): number =>
  pipe(
    { ...demo, meter: patchFpsMeter(demo.meter, time) },
    (measured) => answerInput(measured, mailbox, time),
    (answered) => drawDemo(answered, time),
    (drawn) =>
      requestAnimationFrame((nextTime) =>
        handleFrame(drawn, mailbox, nextTime),
      ),
  );

const startLoop = (
  street: Display,
  chart: Display,
  streetCanvas: HTMLCanvasElement,
): number => {
  const mailbox = createInputMailbox();

  listenToPointer(streetCanvas, PIXEL_SIZE, mailbox);
  listenToKeys(document, mailbox);

  return requestAnimationFrame((time) =>
    handleFrame(
      {
        street,
        chart,
        streetScenery: createStreetScenery(),
        chartScenery: createChartScenery(),
        meter: createFpsMeter(time),
        hud: createDemoHud(),
        clock: 0,
      },
      mailbox,
      time,
    ),
  );
};

const startDemo = (
  streetCanvas: HTMLCanvasElement,
  chartCanvas: HTMLCanvasElement,
): number | undefined =>
  match({
    street: tryCreateDisplay(streetCanvas, DEMO_SETTINGS),
    chart: tryCreateDisplay(chartCanvas, DEMO_SETTINGS),
  })
    .with({ street: nonNullable, chart: nonNullable }, ({ street, chart }) =>
      startLoop(street, chart, streetCanvas),
    )
    .otherwise(() => undefined);

match([document.getElementById('street'), document.getElementById('chart')])
  .with(
    [instanceOf(HTMLCanvasElement), instanceOf(HTMLCanvasElement)],
    ([street, chart]) => startDemo(street, chart),
  )
  .otherwise(noop);
