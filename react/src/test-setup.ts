import "@testing-library/jest-dom/vitest";

// jsdom implements neither of these, and both are used by components that
// react to their environment (`useIsDark` in TimelinePanel, row measurement in
// the timeline and split views). Without them those components throw on mount,
// so the stubs belong here rather than in each test file.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}
