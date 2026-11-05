export type User = {
  id: number;
  name: string;
  email: string;
  /** IANA id of the zone the user's "today" follows. */
  timeZone: string;
  timeZoneMode: TimeZoneMode;
  /** The language the user picked; null until they pick one (the device language applies). */
  language: UserLanguage | null;
}

export type UserLanguage = "en" | "pt-BR";

export type UpdateLanguageRequest = {
  body: {
    language: UserLanguage;
  };
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
