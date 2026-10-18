import { afterAll, afterEach, beforeAll } from "vitest";
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
