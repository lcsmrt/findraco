import { describe, expect, it } from "vitest";

// The guard lives in this project's `afterEach` (`setupUnit.ts`), which runs after the test body, so
// a test cannot catch its own failure. The first test sends a request no handler answers and is
// expected to fail (`it.fails`); its `onTestFailed` callback runs after every `afterEach` and keeps
// the errors, so the second test can assert that the failure came from the guard and named the
// request. Without `assertNone()` in the setup the first test passes, which `it.fails` reports as a
// failure, and the second finds no error.
const UNHANDLED_URL = "http://localhost:9/api/findraco/nowhere";

describe("the unit setup's unhandled-request guard (STD-04 AC 3)", () => {
  let failures: string[] = [];

  it.fails("fails a test that sent a request without a handler, even when the test swallows the error", async ({ onTestFailed }) => {
    onTestFailed(({ task }) => {
      failures = (task.result?.errors ?? []).map((error) => error.message);
    });

    await fetch(UNHANDLED_URL).catch(() => undefined);
  });

  it("names the request in that failure", () => {
    expect(failures).toEqual([
      `Requests without an MSW handler (add one with server.use):\nGET ${UNHANDLED_URL}`,
    ]);
  });
});
