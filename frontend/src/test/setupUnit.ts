import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { i18n, initI18n } from "../i18n/i18n";
import { stubDeviceLanguage } from "./deviceLanguage";
import { stubScreenWidth } from "./screenWidth";
import { server } from "./server";
import { createUnhandledRequestRecorder } from "./unhandledRequests";

// Every test asserts English copy; the device language of the runner must never leak in.
initI18n("en");

const unhandledRequests = createUnhandledRequestRecorder();

beforeAll(() => {
  server.listen({
    onUnhandledRequest(request) {
      unhandledRequests.record(request);
    },
  });
});

beforeEach(async () => {
  // The date layout follows the device region; tests assert the Brazilian layout (04/11/2026) of the
  // device the app is built for, and a test of another region sets its own.
  stubDeviceLanguage("en-BR");
  await i18n.changeLanguage("en");
  // jsdom has no matchMedia; a test of the phone layout stubs a narrower width itself.
  stubScreenWidth(1024);
});

afterEach(() => {
  server.resetHandlers();
  try {
    unhandledRequests.assertNone();
  } finally {
    // One failing test must not fail the next one with its leftovers.
    unhandledRequests.reset();
  }
});

afterAll(() => {
  server.close();
});
