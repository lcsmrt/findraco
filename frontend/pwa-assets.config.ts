import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// The logo already leaves about 20% of the canvas empty on every side, so the preset's extra 30%
// padding would shrink the coin to a speck. Zero padding keeps the coin inside the 80% maskable safe zone.
// The brand background fills the area a transparent PNG would show as white or black on a launcher.
const background = { fit: "contain", background: "#f5f3ec" } as const;

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0 },
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: background },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: background },
  },
  images: ["public/findraco-logo.png"],
});
