export type User = {
  id: number;
  name: string;
  email: string;
  /** IANA id of the zone the user's "today" follows. */
  timeZone: string;
  timeZoneMode: TimeZoneMode;
}

export type TimeZoneMode = "AUTOMATIC" | "PINNED";

export type UpdateTimeZoneRequest = {
  body: {
    mode: TimeZoneMode;
    /** Required to pin; the server ignores it for automatic. */
    zone?: string;
  };
}

export type RegisterUserRequest = {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
