# Kilo Code — Firefox port

A Firefox-compatible build of the Kilo Code Chrome extension (MV3).

## What changed for Firefox

- Removed the Chrome-only `side_panel` manifest entry. The toolbar action now opens a popup (`sidepanel.html`) instead.
- Added `browser_specific_settings.gecko.strict_min_version = "121.0"` so Firefox uses the MV3 service-worker/event-page background.
- Dropped Chrome-only permission `debugger` (Firefox doesn't support `chrome.debugger`) — the background already falls back to the `tabs` and `scripting` APIs gracefully.
- Kept `identity`, `scripting`, `storage`, `tabs` (all supported by Firefox).
- `sidepanel.html` switched to relative asset paths so it loads correctly as both a popup and (formerly) a side panel.
- Hardened the `chrome.sidePanel.setPanelBehavior` call in `background.js` to silently no-op on browsers without the side-panel API.

## Install (temporary / about:debugging)

1. Open Firefox 121 or newer.
2. Visit `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on…** and select `manifest.json` from this folder.
4. The Kilo toolbar button opens the chat UI; click it.

The temporary install is cleared when Firefox restarts. For a permanent install, sign the extension through AMO or self-distribute an `.xpi`.

## Notes / known gaps

- `chrome.debugger` (Chrome DevTools Protocol) is unavailable in Firefox. Code paths that depend on it (`kilo.tabs.listInspectable`, `kilo.tabs.eval`) fall back to `chrome.tabs` and `chrome.scripting.executeScript`. In Firefox, the MAIN-world `eval` path will not run and the UI will report the request as failed.
- The OAuth flow uses `browser.identity.launchWebAuthFlow`, which Firefox supports; the redirect URL is computed via `browser.identity.getRedirectURL("remote-mcp")` (returns a `moz-extension://<uuid>/` URL).