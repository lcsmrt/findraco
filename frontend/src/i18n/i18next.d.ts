import "i18next";
import type en from "./en.json";

// Typing `t` from the source language file makes a missing key a type error, so the build fails on it.
// An interface, because only an interface merges with the library's own declaration.
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: { translation: typeof en };
  }
}
