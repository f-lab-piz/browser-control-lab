# CUA entry and wrapper excerpts received in this investigation

Provenance: initial `mcp__cua_repl.js` response for the agent-created IAB about:blank tab and the tool entry descriptions provided in that same investigation. Relevant received text/signatures are retained below. This is an excerpt, not a complete byte-identical response. No browser/tool was called to reconstruct it during REF1 remediation. Entry TabInfo and backend API TabInfo have different declarations and are labeled separately.

## Entry API types

```ts
type Vec2 = [x: number, y: number];
type ObservationOptions = { emit?: boolean };
type StateOptions = ObservationOptions & { disableDiffing?: boolean };
type ClickOptions = {
  mouseButton?: MouseButton;
  clickCount?: number;
  key?: string;
  durationMs?: number;
};
type PressKeyOptions = { durationMs?: number };
type Direction = "up" | "down" | "left" | "right" | "u" | "d" | "l" | "r";
type MouseButton = "left" | "right" | "middle" | "l" | "r" | "m";

interface Target<ScreenshotResult = Uint8Array | ScreenshotRegion[]> {
  getAXState(options?: StateOptions): Promise<string>;
  getScreenshot(options?: ObservationOptions): Promise<ScreenshotResult>;
  getAXStateAndScreenshot(options?: StateOptions): Promise<StateAndScreenshot>;
  click(target: number | Vec2, options?: ClickOptions): Promise<void>;
  drag(from: Vec2, to: Vec2): Promise<void>;
  scroll(target: number | Vec2, direction: Direction, pages?: number): Promise<void>;
  selectText(elementIndex: number, text: string, options?: SelectTextOptions): Promise<void>;
  setValue(elementIndex: number, value: string): Promise<void>;
  performSecondaryAction(elementIndex: number, action: string): Promise<void>;
}

type BrowserInfo = {
  id: string;
  name?: string;
  family?: string;
  type?: "iab" | "extension" | "cdp" | "mcpapps";
  profileName?: string;
  metadata?: { extensionInstanceId?: string; codexSessionId?: string };
};

type TabInfo = {
  id: string;
  providerTabId?: string;
  browserId: string;
  title?: string;
  url?: string;
};

type BrowserOptions = { browser?: string };
type GetBrowserOptions = { id?: string; extensionInstanceId?: string; url?: string };
type CreateBrowserTabOptions = { visible?: boolean; sessionName?: string };

/** Native input wrappers throw on DOM-only tabs. Use documented Playwright locators instead. */
interface Tab extends Target<Uint8Array> {
  paste(elementIndex: number | null, text: string, options?: PasteOptions): Promise<void>;
  pressKey(elementIndex: number | null, key: string, options?: PressKeyOptions): Promise<void>;
  typeText(elementIndex: number | null, text: string): Promise<void>;
  readonly id: string;
  goto?(url: string): Promise<void>;
  back?(): Promise<void>;
  forward?(): Promise<void>;
  reload?(): Promise<void>;
  close?(): Promise<void>;
  markDeliverable?(): Promise<void>;
  markHandoff?(): Promise<void>;
}

declare const cua: {
  /** Select without opening a tab. Use the returned browserId with createBrowserTab. */
  getBrowser(options?: GetBrowserOptions): Promise<Browser>;
  /** Apply options before opening the tab; omitted settings stay unchanged, unsupported settings throw. */
  createBrowserTab(
    browserId: string,
    url?: string,
    options?: CreateBrowserTabOptions,
  ): Promise<Tab>;
  /** Bind an existing tab; a string is a tab ID. */
  getTab(
    reference: string | { mention: string } | { url: string },
    options?: BrowserOptions,
  ): Promise<Tab>;
  listBrowsers(options?: ObservationOptions): Promise<BrowserInfo[]>;
  listTabs(options?: BrowserOptions & ObservationOptions): Promise<TabInfo[]>;
};
```

## Entry discovery/observation explanations

"Listing tabs does not claim them."

"For DOM-only tabs, `getAXState()` uses a DOM snapshot without numeric element indices. `getScreenshot()` uses the tab screenshot API. Disabled observation APIs report an error. Native input wrappers remain present but throw before input. Use the documented Playwright locators to click controls and fill fields."

"For image output, use `nodeRepl.emitImage(...)`. The API accepts data or file URLs, PNG/JPEG/WebP bytes, or `{ bytes, mimeType }`."

"For text output, use `nodeRepl.write(...)`. The API accepts strings and other values. Use `JSON.stringify(...)` when you want JSON."

"`cua_repl` state is persistent across calls"

"`cua.getBrowser()` automatically displays its first-use documentation; do not write the returned browser object or reread its documentation."

"Calling `cua.getApp(...)`, `cua.getTab(...)`, and `cua.createBrowserTab(...)` returns app or tab bindings and automatically displays the latest AX state after they run."

## Tool entry metadata excerpts

`mcp__cua_repl.js` describes `timeout_ms` as: "Optional execution timeout in milliseconds. Defaults to 30000 (30 seconds) when omitted."

`mcp__cua_repl.js_reset` description:

"Reset the persistent cua_repl JavaScript session. All JavaScript bindings are discarded. The next cua_repl.js call initializes a fresh runtime for the enabled surfaces. This does not close browser tabs or native apps, or erase their state."

## Additional Capabilities: IAB initial response

"`visibility`: Use to show or hide the browser to the user, and to determine the browser's current visibility. Keep browser work in the background unless the user asks to see it or live viewing is useful. When the browser should be visible, call set(true)."

"Read with `await (await browser.capabilities.get("visibility")).documentation()`."

## Current API Reference: logs explanatory comments

```ts
interface TabDevLogsOptions {
  filter?: string; // Optional substring filter applied to the rendered log message.
  levels?: Array<"debug" | "info" | "log" | "warn" | "error" | "warning">; // Optional levels to include.
  limit?: number; // Maximum number of logs to return.
}

interface TabDevLogEntry {
  level: "debug" | "info" | "log" | "warn" | "error"; // Console log level.
  message: string; // Rendered log message text.
  timestamp: string; // ISO 8601 timestamp for when the runtime captured the log.
  url?: string; // Source URL reported by the browser runtime, when available.
}
```

## Current API Reference: relevant explanatory comments

```ts
interface PlaywrightLocator {
  press(value: string, options: { timeoutMs?: number }): Promise<void>; // Press a keyboard key while this locator is focused.
  pressSequentially(value: string, options: LocatorPressSequentiallyOptions): Promise<void>; // Focus the element and press each character in the text sequentially without clearing its existing value.
  type(value: string, options: { timeoutMs?: number }): Promise<void>; // Type text into the element without clearing existing content.
}
```

Only listed declarations/received descriptions are evidence. This excerpt makes no claim about implementations, absence from all product surfaces, or transactional atomicity of the single-call native actions.
