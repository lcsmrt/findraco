import { onTestFinished } from "vitest";
import { server } from "./server";

/**
 * Returns a list that fills with a copy of every request the current test sends, so the test can
 * assert what reached the network (method, URL, query, body) while the handler factories stay
 * plain responses. The copy keeps the body readable after the handler consumed the original.
 */
export function recordRequests(): Request[] {
  const requests: Request[] = [];

  function record({ request }: { request: Request }) {
    requests.push(request.clone());
  }

  server.events.on("request:start", record);
  onTestFinished(() => {
    server.events.removeListener("request:start", record);
  });
  return requests;
}
