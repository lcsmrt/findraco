/**
 * Sets the language tag the browser reports (`navigator.language`), whose region picks the date layout.
 * jsdom's own getter is read-only, so the property is redefined on the navigator itself.
 */
export function stubDeviceLanguage(tag: string) {
  Object.defineProperty(window.navigator, "language", {
    value: tag,
    configurable: true,
  });
}
