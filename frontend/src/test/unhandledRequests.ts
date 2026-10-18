export type UnhandledRequestRecorder = {
  record: (request: Request) => void;
  assertNone: () => void;
  reset: () => void;
};

/**
 * Collects requests that reached no MSW handler. MSW's own `onUnhandledRequest: "error"` only fails
 * the request, so code that swallows the error would still pass; the setup asserts here instead.
 */
export function createUnhandledRequestRecorder(): UnhandledRequestRecorder {
  let requests: string[] = [];

  return {
    record(request) {
      requests.push(`${request.method} ${request.url}`);
    },
    assertNone() {
      if (requests.length === 0) return;
      throw new Error(
        `Requests without an MSW handler (add one with server.use):\n${requests.join("\n")}`,
      );
    },
    reset() {
      requests = [];
    },
  };
}
