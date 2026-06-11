/**
 * Force the site to render as the "desktop site" on every device.
 *
 * How it works: mobile browsers honour a fixed-width viewport and scale
 * the page down to fit the screen (the same effect as Android/Chrome's
 * "Desktop site" toggle). Desktop browsers ignore the viewport width and
 * use the real window width, so they are unaffected.
 *
 * We also re-assert the setting on orientation changes and when a page is
 * restored from the back/forward cache, since some browsers reset it.
 */

const DESKTOP_WIDTH = 1280;
const VIEWPORT = `width=${DESKTOP_WIDTH}`;

function applyDesktopViewport(): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "viewport";
    document.head.appendChild(meta);
  }
  if (meta.content !== VIEWPORT) {
    meta.content = VIEWPORT;
  }
}

export function enableDesktopView(): void {
  applyDesktopViewport();
  window.addEventListener("orientationchange", applyDesktopViewport);
  window.addEventListener("pageshow", applyDesktopViewport);
}
