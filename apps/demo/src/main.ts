import { runEffect } from '@cassette-canvas/common';
import {
  addHud,
  type Display,
  drawScreen,
  tryCreateDisplay,
} from '@cassette-canvas/engine';
import { constant, noop } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { createChartScenery } from './chart/create-chart-scenery';
import { createChartScreen } from './chart/create-chart-screen';
import { DEMO_SETTINGS, PIXEL_SIZE } from './consts';
import { computeDayCycle } from './day/compute-day-cycle';
import type { Demo } from './demo/types/demo';
import { createFpsMeter } from './fps/create-fps-meter';
import { patchFpsMeter } from './fps/patch-fps-meter';
import { START_CLOCK } from './hud/consts';
import { createDemoHud } from './hud/create-demo-hud';
import { patchDemoHud } from './hud/patch-demo-hud';
import { patchHudState } from './hud/patch-hud-state';
import { createInputMailbox } from './input/create-input-mailbox';
import { readInputEvents } from './input/read-input-events';
import type { InputMailbox } from './input/types/input-mailbox';
import { watchKeys } from './input/watch-keys';
import { watchPointer } from './input/watch-pointer';
import { createStreetScenery } from './street/create-street-scenery';
import { createStreetScreen } from './street/create-street-screen';

const { instanceOf, nonNullable } = P;

const toSceneTime = (demo: Demo, time: number): number => time + demo.clock;

const drawStreet = (demo: Demo, time: number): Display =>
  drawScreen(
    demo.street,
    addHud(
      createStreetScreen(demo.streetScenery, toSceneTime(demo, time)),
      demo.hud,
    ),
    time,
  );

const drawChart = (demo: Demo, time: number): Display =>
  drawScreen(
    demo.chart,
    createChartScreen(
      demo.chartScenery,
      demo.meter.fps,
      toSceneTime(demo, time),
    ),
    time,
  );

const patchDemoFace = (demo: Demo, time: number): Demo => ({
  ...demo,
  hud: patchDemoHud(
    demo.hud,
    demo.meter.fps,
    computeDayCycle(toSceneTime(demo, time)),
  ),
});

const patchDemoInput = (
  demo: Demo,
  mailbox: InputMailbox,
  time: number,
): Demo => ({
  ...demo,
  ...patchHudState(
    { hud: demo.hud, clock: demo.clock },
    readInputEvents(mailbox),
    time,
  ),
});

const patchDemoFrame = (
  demo: Demo,
  mailbox: InputMailbox,
  time: number,
): Demo =>
  pipe(
    { ...demo, meter: patchFpsMeter(demo.meter, time) },
    (measured) => patchDemoInput(measured, mailbox, time),
    (answered) => patchDemoFace(answered, time),
  );

const drawDemo = (demo: Demo, time: number): Demo => ({
  ...demo,
  street: drawStreet(demo, time),
  chart: drawChart(demo, time),
});

const handleFrame = (
  demo: Demo,
  mailbox: InputMailbox,
  time: number,
): number => {
  const drawn = drawDemo(patchDemoFrame(demo, mailbox, time), time);

  return requestAnimationFrame((nextTime) =>
    handleFrame(drawn, mailbox, nextTime),
  );
};

const createDemo = (street: Display, chart: Display, time: number): Demo => ({
  street,
  chart,
  streetScenery: createStreetScenery(),
  chartScenery: createChartScenery(),
  meter: createFpsMeter(time),
  hud: createDemoHud(),
  clock: START_CLOCK,
});

const watchDemoInput = (
  streetCanvas: HTMLCanvasElement,
  mailbox: InputMailbox,
): InputMailbox =>
  pipe(
    mailbox,
    (watched) =>
      runEffect(watched, (box) => watchPointer(streetCanvas, PIXEL_SIZE, box)),
    (watched) => runEffect(watched, (box) => watchKeys(document, box)),
  );

const startLoop = (
  street: Display,
  chart: Display,
  streetCanvas: HTMLCanvasElement,
): number => {
  const mailbox = watchDemoInput(streetCanvas, createInputMailbox());

  return requestAnimationFrame((time) =>
    handleFrame(createDemo(street, chart, time), mailbox, time),
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
    .otherwise(constant(undefined));

match([document.getElementById('street'), document.getElementById('chart')])
  .with(
    [instanceOf(HTMLCanvasElement), instanceOf(HTMLCanvasElement)],
    ([street, chart]) => startDemo(street, chart),
  )
  .otherwise(noop);
