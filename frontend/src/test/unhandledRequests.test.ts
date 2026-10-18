import { describe, expect, it } from "vitest";
import { createUnhandledRequestRecorder } from "./unhandledRequests";

describe("createUnhandledRequestRecorder (STD-04 AC 3)", () => {
  it("passes when no request was recorded", () => {
    const recorder = createUnhandledRequestRecorder();

    expect(() => recorder.assertNone()).not.toThrow();
  });

  it("throws naming the method and URL of every recorded request", () => {
    const recorder = createUnhandledRequestRecorder();

    recorder.record(new Request("http://localhost/api/findraco/plan"));
    recorder.record(new Request("http://localhost/api/findraco/user", { method: "POST" }));

    expect(() => recorder.assertNone()).toThrow(
      /GET http:\/\/localhost\/api\/findraco\/plan\nPOST http:\/\/localhost\/api\/findraco\/user$/,
    );
  });

  it("forgets recorded requests on reset", () => {
    const recorder = createUnhandledRequestRecorder();
    recorder.record(new Request("http://localhost/api/findraco/plan"));

    recorder.reset();

    expect(() => recorder.assertNone()).not.toThrow();
  });
});
