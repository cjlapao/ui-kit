// Vitest setup for the Vue UI Kit.
// jsdom does not implement ResizeObserver, which TruncatedText (and friends)
// observe for overflow detection. Provide a no-op stand-in so components that
// render text cells can mount in tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}