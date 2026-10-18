import { setupServer } from "msw/node";

// No default handlers: each test declares the responses it relies on with `server.use(...)`.
export const server = setupServer();
