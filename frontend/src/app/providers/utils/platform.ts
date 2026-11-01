type StandaloneInput = {
  /** Result of `matchMedia("(display-mode: standalone)").matches`. */
  displayModeStandalone: boolean;
  /** `navigator.standalone`, which only iOS Safari defines and which `display-mode` does not mirror there. */
  navigatorStandalone: boolean | undefined;
};

export function isStandalone({ displayModeStandalone, navigatorStandalone }: StandaloneInput) {
  return displayModeStandalone || navigatorStandalone === true;
}

export function isIos(userAgent: string, maxTouchPoints: number) {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  // iPadOS 13+ reports a Mac user agent; a real Mac has no touch screen, so touch points tell them apart.
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}
