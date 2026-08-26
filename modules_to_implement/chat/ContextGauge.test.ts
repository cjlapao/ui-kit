import { render, screen, cleanup } from "@testing-library/vue";
import { describe, it, expect, afterEach } from "vitest";
import ContextGauge from "./components/ContextGauge.vue";

afterEach(cleanup);

describe("ContextGauge", () => {
  it("shows the percentage of the context window used", () => {
    const { unmount } = render(ContextGauge, { props: { used: 50, max: 200 } });
    expect(screen.getByTestId("context-gauge")).toBeInTheDocument();
    expect(screen.getByTestId("context-percent").textContent?.trim()).toBe("25%");
    unmount();
  });

  it("clamps above-100% usage to 100%", () => {
    const { unmount } = render(ContextGauge, { props: { used: 500, max: 200 } });
    expect(screen.getByTestId("context-percent").textContent?.trim()).toBe("100%");
    unmount();
  });

  it("renders nothing when the model has no max context", () => {
    render(ContextGauge, { props: { used: 5, max: 0 } });
    expect(screen.queryByTestId("context-gauge")).toBeNull();
  });
});
