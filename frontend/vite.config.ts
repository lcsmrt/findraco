/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf-8"),
);
const buildDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

/**
 * Every public Base UI entry point (`@base-ui/react/tabs`, …), read from its package manifest.
 *
 * The Storybook project pre-bundles dependencies from what its first scan finds and reuses that cache
 * until the lockfile changes. A Base UI subpath imported for the first time (a new primitive) is then
 * discovered mid-run: Vite re-optimises, reloads, and the stories loading at that moment fail. Listing
 * every subpath up front makes the bundle complete before any story loads, so no retry is needed.
 */
function baseUiEntryPoints(): string[] {
  const manifestPath = createRequire(import.meta.url).resolve("@base-ui/react/package.json");
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, "utf-8"));
  if (typeof manifest !== "object" || manifest === null || !("exports" in manifest)) {
    throw new Error(`No exports map in ${manifestPath}`);
  }
  const { exports } = manifest;
  if (typeof exports !== "object" || exports === null) {
    throw new Error(`No exports map in ${manifestPath}`);
  }
  return Object.keys(exports)
    .filter((subpath) => subpath !== "./package.json" && subpath !== "./types")
    .filter((subpath) => !subpath.startsWith("./internals/"))
    .map((subpath) => path.posix.join("@base-ui/react", subpath));
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        optimizeDeps: {
          include: baseUiEntryPoints(),
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["src/test/setupUnit.ts"],
        },
      },
      {
        extends: true,
        test: {
          // Lint config, local rules and gate scripts run in Node: they never touch the DOM.
          name: "tooling",
          environment: "node",
          include: [
            "eslint.config.test.ts",
            "eslint/**/*.test.ts",
            "scripts/**/*.test.ts",
          ],
          // Vitest's default exclude drops every `eslint.config.*` file, which would skip the config test.
          exclude: ["**/node_modules/**", "**/dist/**"],
        },
      },
    ],
  },
});
