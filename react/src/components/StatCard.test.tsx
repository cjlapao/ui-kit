import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import StatCard from "./StatCard";

describe("StatCard — content", () => {
  it("renders label, value and trend", () => {
    const { container } = render(
      <StatCard
        label="Total balance"
        value="$1.42M"
        trend={{ value: "+12.4%", direction: "up" }}
      />,
    );
    expect(container.textContent).toContain("Total balance");
    expect(container.textContent).toContain("$1.42M");
    expect(container.textContent).toContain("+12.4%");
  });

  it("hides an empty label", () => {
    const { container } = render(<StatCard label="" value="$1.42M" />);
    const labelSpans = [...container.querySelectorAll("span")].filter((el) =>
      el.textContent?.includes("Total balance"),
    );
    expect(labelSpans).toHaveLength(0);
    expect(container.textContent).toContain("$1.42M");
  });

  it("hides an empty value", () => {
    const { container } = render(<StatCard label="Total balance" value="" />);
    expect(container.textContent).not.toContain("$");
    expect(container.textContent).toContain("Total balance");
  });

  it("hides the trend when not provided", () => {
    const { container } = render(<StatCard label="A" value="1" />);
    expect(container.querySelector(".rounded-full")).toBeNull();
  });

  it("shows the trend pill when provided", () => {
    const { container } = render(
      <StatCard label="A" value="1" trend={{ value: "-3.1%", direction: "down" }} />,
    );
    const pill = container.querySelector(".rounded-full");
    expect(pill).not.toBeNull();
    expect(pill!.textContent).toContain("-3.1%");
  });

  it("renders an icon chip when an icon is set", () => {
    const { container } = render(<StatCard value="1" icon="Shop" />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("renders no icon svg when icon is omitted", () => {
    const { container } = render(<StatCard value="1" />);
    expect(container.querySelectorAll("svg").length).toBe(0);
  });
});

describe("StatCard — live health strip", () => {
  it("mounts an EcgMonitor when health is set", () => {
    const { container } = render(
      <StatCard label="Service health" value="99.98%" health="healthy" />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas!.getAttribute("aria-label")).toBe(
      "ECG monitor, status: healthy",
    );
  });

  it("switches the ECG state through the prop", () => {
    const { container, rerender } = render(
      <StatCard value="99.98%" health="warning" />,
    );
    expect(container.querySelector("canvas")!.getAttribute("aria-label")).toBe(
      "ECG monitor, status: warning",
    );
    rerender(<StatCard value="99.98%" health="unhealthy" />);
    expect(container.querySelector("canvas")!.getAttribute("aria-label")).toBe(
      "ECG monitor, status: unhealthy",
    );
  });

  it("renders no canvas when health is omitted", () => {
    const { container } = render(<StatCard value="99.98%" />);
    expect(container.querySelector("canvas")).toBeNull();
  });
});

describe("StatCard — sizing and surface", () => {
  it("steps the value font with size", () => {
    const sizes = { sm: "text-xl", md: "text-3xl", lg: "text-4xl" } as const;
    for (const [size, cls] of Object.entries(sizes)) {
      const { container, unmount } = render(
        <StatCard value="1" size={size as "sm" | "md" | "lg"} />,
      );
      expect(container.querySelector(`.${cls}`)).not.toBeNull();
      unmount();
    }
  });

  it("stays a single panel surface", () => {
    const { container } = render(
      <StatCard label="A" value="1" icon="Shop" trend={{ value: "+1%", direction: "up" }} />,
    );
    expect(container.firstElementChild).not.toBeNull();
    expect(container.firstElementChild!.children.length).toBeLessThanOrEqual(1);
  });
});
