import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";
import { i18n, initI18n } from "../src/i18n/i18n";
import { LANGUAGES } from "../src/i18n/languages";
import "../src/index.css";

// Stories assert English; the toolbar `locale` global switches the language to review a screen in Portuguese.
initI18n("en");

// Stories assert the Brazilian date layout (04/11/2026) whatever the browser running them reports.
Object.defineProperty(window.navigator, "language", { value: "en-BR", configurable: true });

const preview: Preview = {
  initialGlobals: { locale: "en" },
  globalTypes: {
    locale: {
      description: "Interface language",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: [...LANGUAGES],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
    // A violation fails the story test: fix the component or the story, never the check.
    a11y: { test: "error" },
  },
  decorators: [
    (Story, { globals }) => {
      if (i18n.language !== globals.locale)
        void i18n.changeLanguage(String(globals.locale));
      return (
        <div className="bg-background overflow-auto rounded p-6">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
