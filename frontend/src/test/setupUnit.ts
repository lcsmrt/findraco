import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { stubScreenWidth } from "./screenWidth";
import { server } from "./server";
import { createUnhandledRequestRecorder } from "./unhandledRequests";

const unhandledRequests = createUnhandledRequestRecorder();

beforeAll(() => {
  server.listen({
    onUnhandledRequest(request) {
      unhandledRequests.record(request);
    },
  });
});

// jsdom has no matchMedia; a test of the phone layout stubs a narrower width itself.
beforeEach(() => {
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
