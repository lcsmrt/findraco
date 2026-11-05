import "i18next";
import type en from "./en.json";

// Typing `t` from the source language file makes a missing key a type error, so the build fails on it.
declare module "i18next" {
  type CustomTypeOptions = {
    defaultNS: "translation";
    resources: { translation: typeof en };
  };
}
