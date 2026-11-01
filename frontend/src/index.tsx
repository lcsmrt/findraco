import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { installPromptStore } from "./app/providers/installPromptStore";
import "./index.css";

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
