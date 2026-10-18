// The import makes this file a module, so the block below augments axios's types instead of
// replacing them with an ambient module that has only this one interface.
import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    /** Set on the single retry that follows a session renewal. */
    sessionRetried?: boolean;
  }
}
