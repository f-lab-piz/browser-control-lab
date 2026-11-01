# Current CUA tool response: verbatim relevant API excerpts

Source: first `mcp__cua_repl.js` response after createBrowserTab, 2026-11-01.
This is a selected excerpt, not a byte-identical complete tool response.

```ts
interface Browser {
  browserId: string;
  capabilities: BrowserCapabilityCollection;
  tabs: Tabs;
  user: BrowserUser;
  documentation(): Promise<string>;
  history(options: BrowserHistoryOptions): Promise<Array<BrowserHistoryEntry>>;
  nameSession(name: string): Promise<void>;
}
interface Tabs {
  get(id: string): Promise<Tab>;
  list(): Promise<Array<TabInfo>>;
  new(): Promise<Tab>;
  selected(): Promise<undefined | Tab>;
}
interface Tab {
  capabilities: TabCapabilityCollection;
  clipboard: TabClipboardAPI;
  content: ContentAPI;
  dev: TabDevAPI;
  id: string;
  playwright: PlaywrightAPI;
  back(): Promise<void>;
  close(): Promise<void>;
  forward(): Promise<void>;
  getJsDialog(): Promise<undefined | Dialog>;
  goto(url: string): Promise<void>;
  markDeliverable(): Promise<void>;
  markHandoff(): Promise<void>;
  reload(): Promise<void>;
  screenshot(options: ScreenshotOptions): Promise<Uint8Array>;
  title(): Promise<undefined | string>;
  url(): Promise<undefined | string>;
}
interface PlaywrightAPI {
  domSnapshot(): Promise<string>;
  evaluate<TResult, TArg>(pageFunction: PlaywrightEvaluateFunction<TArg, TResult>, arg?: TArg, options?: PlaywrightEvaluateOptions): Promise<TResult>;
  expectNavigation<T>(action: () => Promise<T>, options: { timeoutMs?: number; url?: string; waitUntil?: LoadState }): Promise<T>;
  frameLocator(frameSelector: string): PlaywrightFrameLocator;
  getByLabel(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  getByPlaceholder(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  getByRole(role: string, options: { exact?: boolean; name?: TextMatcher }): PlaywrightLocator;
  getByTestId(testId: string): PlaywrightLocator;
  getByText(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  locator(selector: string): PlaywrightLocator;
  waitForEvent(event: "download", options?: WaitForEventOptions): Promise<PlaywrightDownload>;
  waitForEvent(event: "filechooser", options?: WaitForEventOptions): Promise<PlaywrightFileChooser>;
  waitForLoadState(options: PageWaitForLoadStateOptions): Promise<void>;
  waitForTimeout(timeoutMs: number): Promise<void>;
  waitForURL(url: string, options: PageWaitForURLOptions): Promise<void>;
}
interface PlaywrightFrameLocator {
  frameLocator(frameSelector: string): PlaywrightFrameLocator;
  getByLabel(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  getByPlaceholder(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  getByRole(role: string, options: { exact?: boolean; name?: TextMatcher }): PlaywrightLocator;
  getByTestId(testId: string): PlaywrightLocator;
  getByText(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  locator(selector: string): PlaywrightLocator;
}
interface PlaywrightLocator {
  all(): Promise<Array<PlaywrightLocator>>;
  allTextContents(options: { timeoutMs?: number }): Promise<Array<string>>;
  and(locator: PlaywrightLocator): PlaywrightLocator;
  check(options: LocatorCheckOptions): Promise<void>;
  click(options: LocatorClickOptions): Promise<void>;
  count(): Promise<number>;
  dblclick(options: LocatorClickOptions): Promise<void>;
  downloadMedia(options: LocatorDownloadMediaOptions): Promise<string>;
  evaluate<TResult, TArg>(pageFunction: LocatorEvaluateFunction<TArg, TResult>, arg?: TArg, options?: PlaywrightEvaluateOptions): Promise<TResult>;
  evaluateAll<TResult, TArg>(pageFunction: LocatorEvaluateAllFunction<TArg, TResult>, arg?: TArg, options?: PlaywrightEvaluateOptions): Promise<TResult>;
  fill(value: string, options: { timeoutMs?: number }): Promise<void>;
  filter(options: LocatorFilterOptions): PlaywrightLocator;
  first(): PlaywrightLocator;
  getAttribute(name: string, options: { timeoutMs?: number }): Promise<null | string>;
  getByLabel(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  getByPlaceholder(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  getByRole(role: string, options: { exact?: boolean; name?: TextMatcher }): PlaywrightLocator;
  getByTestId(testId: string): PlaywrightLocator;
  getByText(text: TextMatcher, options: { exact?: boolean }): PlaywrightLocator;
  innerText(options: { timeoutMs?: number }): Promise<string>;
  isEnabled(): Promise<boolean>;
  isVisible(): Promise<boolean>;
  last(): PlaywrightLocator;
  locator(selector: string, options: LocatorLocatorOptions): PlaywrightLocator;
  nth(index: number): PlaywrightLocator;
  or(locator: PlaywrightLocator): PlaywrightLocator;
  press(value: string, options: { timeoutMs?: number }): Promise<void>;
  pressSequentially(value: string, options: LocatorPressSequentiallyOptions): Promise<void>;
  selectOption(value: SelectOptionInput | Array<SelectOptionInput>, options: { timeoutMs?: number }): Promise<void>;
  setChecked(checked: boolean, options: LocatorCheckOptions): Promise<void>;
  textContent(options: { timeoutMs?: number }): Promise<null | string>;
  type(value: string, options: { timeoutMs?: number }): Promise<void>;
  uncheck(options: LocatorCheckOptions): Promise<void>;
  waitFor(options: LocatorWaitForOptions): Promise<void>;
}
interface PlaywrightDownload {
  path(options: { timeoutMs?: number }): Promise<null | string>;
}
interface PlaywrightFileChooser {
  isMultiple(): boolean;
  setFiles(files: FileChooserFiles, options: { timeoutMs?: number }): Promise<void>;
}
interface TabDevAPI {
  logs(options: TabDevLogsOptions): Promise<Array<TabDevLogEntry>>;
}
interface AlertDialog { type: "alert"; dismiss(): Promise<void>; }
interface BeforeUnloadDialog { type: "beforeunload"; dismiss(): Promise<void>; }
interface ConfirmDialog { type: "confirm"; accept(): Promise<void>; dismiss(): Promise<void>; }
interface PromptDialog { type: "prompt"; accept(text: string): Promise<void>; dismiss(): Promise<void>; }
interface Documentation { get(name: string): Promise<string>; }
type Dialog = AlertDialog | BeforeUnloadDialog | ConfirmDialog | PromptDialog;
type ScreenshotOptions = { clip?: ClipRect; fullPage?: boolean; };
type PlaywrightEvaluateFunction<TArg, TResult> = string | (arg: TArg) => TResult | Promise<TResult>;
type PlaywrightEvaluateOptions = { timeoutMs?: number; };
type LoadState = "load" | "domcontentloaded" | "networkidle";
type TextMatcher = string | RegExp;
type WaitForEventOptions = { timeoutMs?: number; };
type PageWaitForLoadStateOptions = { state?: LoadState; timeoutMs?: number; };
type PageWaitForURLOptions = { timeoutMs?: number; waitUntil?: WaitUntil; };
type LocatorCheckOptions = { force?: boolean; timeoutMs?: number; };
type LocatorClickOptions = { button?: MouseButton; force?: boolean; modifiers?: Array<KeyboardModifier>; timeoutMs?: number; };
type LocatorDownloadMediaOptions = { timeoutMs?: number; };
type LocatorEvaluateFunction<TArg, TResult> = string | (element: Element, arg: TArg) => TResult | Promise<TResult>;
type LocatorEvaluateAllFunction<TArg, TResult> = string | (elements: Array<Element>, arg: TArg) => TResult | Promise<TResult>;
type LocatorFilterOptions = { has?: PlaywrightLocator; hasNot?: PlaywrightLocator; hasNotText?: TextMatcher; hasText?: TextMatcher; visible?: boolean; };
type LocatorLocatorOptions = { has?: PlaywrightLocator; hasNot?: PlaywrightLocator; hasNotText?: TextMatcher; hasText?: TextMatcher; };
type LocatorPressSequentiallyOptions = { timeoutMs?: number; };
type SelectOptionInput = string | SelectOptionDescriptor;
type LocatorWaitForOptions = { state: WaitForState; timeoutMs?: number; };
type FileChooserFiles = string | Array<string>;
interface TabDevLogsOptions { filter?: string; levels?: Array<"debug" | "info" | "log" | "warn" | "error" | "warning">; limit?: number; }
interface TabDevLogEntry { level: "debug" | "info" | "log" | "warn" | "error"; message: string; timestamp: string; url?: string; }
type ClipRect = { height: number; width: number; x: number; y: number; };
type WaitUntil = LoadState | "commit";
type MouseButton = "left" | "right" | "middle";
type KeyboardModifier = "Alt" | "Control" | "ControlOrMeta" | "Meta" | "Shift";
type SelectOptionDescriptor = { index?: number; label?: string; value?: string; };
type WaitForState = "attached" | "detached" | "visible" | "hidden";
```

Relevant exact descriptions retained separately from signatures:

- `domSnapshot`: "Return a snapshot of the current DOM as a string, including expanded iframe body content when available."
- `PlaywrightAPI.evaluate`: "Evaluate JavaScript in a read-only page scope."
- `PlaywrightLocator.evaluate`: "Evaluate JavaScript in a read-only scope; the locator must resolve unambiguously to one element."
- `PlaywrightLocator.evaluateAll`: "Evaluate read-only JavaScript against all elements matched by this locator."
- `textContent`: "Return the raw textContent of the first matched element (or null if missing)."
- `getAttribute`: "Return an attribute value from the first matched element."
- `isEnabled`: "Whether the first matched element is currently enabled."
- `isVisible`: "Whether the first matched element is currently visible."
- `waitForEvent(download)`: "Wait for the next download to complete; call before clicking its download control."
- `setFiles`: "Set the files for this chooser using absolute paths visible to the browser."

The initial CUA entry docs additionally state: "Native input wrappers throw on DOM-only tabs. Use documented Playwright locators instead."
The initial output docs recommend `nodeRepl.write(...)` for text, and `nodeRepl.emitImage(...)` for images, accepting data/file URLs, PNG/JPEG/WebP bytes, or `{bytes,mimeType}`.
