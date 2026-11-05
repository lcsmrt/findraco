import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { installPromptStore } from "./app/providers/installPromptStore";
import { initI18n } from "./i18n/i18n";
import { resolveDeviceLanguage } from "./i18n/utils/resolveDeviceLanguage";
import "./index.css";

// The device language until a signed-in user's saved one applies.
initI18n(resolveDeviceLanguage(navigator.languages));

// Before React mounts: the browser fires `beforeinstallprompt` once and early, and an event nobody
// listens for is lost.
installPromptStore.listen(window);

const root = document.getElementById("root");
if (!root) throw new Error("root element not foundl.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
