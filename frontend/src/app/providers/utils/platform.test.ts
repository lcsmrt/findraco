import { describe, expect, it } from "vitest";
import { isIos, isStandalone } from "./platform";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const IPAD =
  "Mozilla/5.0 (iPad; CPU OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1";
const MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";
const ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36";

describe("isStandalone", () => {
  it("is true by display mode (PWA-05 AC 3)", () => {
    expect(isStandalone({ displayModeStandalone: true, navigatorStandalone: undefined })).toBe(true);
  });

  it("is true by navigator.standalone (PWA-05 AC 3)", () => {
    expect(isStandalone({ displayModeStandalone: false, navigatorStandalone: true })).toBe(true);
  });

  it("is false in a browser tab (PWA-05 AC 3)", () => {
    expect(isStandalone({ displayModeStandalone: false, navigatorStandalone: undefined })).toBe(false);
    expect(isStandalone({ displayModeStandalone: false, navigatorStandalone: false })).toBe(false);
  });
});

describe("isIos", () => {
  it("recognises iPhone and iPad (PWA-05 AC 2)", () => {
    expect(isIos(IPHONE, 5)).toBe(true);
    expect(isIos(IPAD, 5)).toBe(true);
  });

  it("recognises iPadOS reporting as a Mac with a touch screen (PWA-05 AC 2)", () => {
    expect(isIos(MAC, 5)).toBe(true);
  });

  it("rejects a desktop Mac and Android (PWA-05 AC 2)", () => {
    expect(isIos(MAC, 0)).toBe(false);
    expect(isIos(ANDROID, 5)).toBe(false);
  });
});
