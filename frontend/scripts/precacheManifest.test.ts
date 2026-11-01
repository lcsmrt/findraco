import { describe, expect, it } from "vitest";
import { findDuplicateUrls, rejectDuplicateUrls } from "./precacheManifest.ts";

describe("findDuplicateUrls", () => {
  it("returns nothing for distinct URLs", () => {
    expect(findDuplicateUrls(["index.html", "assets/app.js"])).toEqual([]);
  });

  it("returns a repeated URL once, however often it repeats", () => {
    expect(
      findDuplicateUrls([
        "manifest.webmanifest",
        "index.html",
        "manifest.webmanifest",
        "manifest.webmanifest",
      ]),
    ).toEqual(["manifest.webmanifest"]);
  });
});

describe("rejectDuplicateUrls", () => {
  const manifest = [{ url: "index.html" }, { url: "assets/app.js" }];

  it("keeps a manifest without duplicates unchanged (PWA-02 AC 1)", () => {
    expect(rejectDuplicateUrls(["manifest.webmanifest"])(manifest)).toEqual({
      manifest,
    });
  });

  it("throws when two globbed entries share a URL (PWA-02 AC 1)", () => {
    expect(() => rejectDuplicateUrls([])([...manifest, { url: "index.html" }])).toThrow(
      "index.html",
    );
  });

  it("throws when a globbed entry repeats one added by the plugin (PWA-02 AC 1)", () => {
    expect(() =>
      rejectDuplicateUrls(["manifest.webmanifest"])([...manifest, { url: "manifest.webmanifest" }]),
    ).toThrow("manifest.webmanifest");
  });
});
