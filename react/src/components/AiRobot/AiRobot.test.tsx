import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AiRobot } from "./AiRobot";

describe("AiRobot", () => {
  it("renders on the server as a named image", () => {
    expect(renderToString(<AiRobot label="Assistant" />)).toContain('aria-label="Assistant"');
  });
  it("supports decorative, paused, and invalid-size states", () => {
    const { container, rerender } = render(<AiRobot size={NaN} paused />);
    const robot = container.querySelector("svg")!;
    expect(robot.getAttribute("aria-hidden")).toBe("true");
    expect(robot.getAttribute("data-paused")).toBe("true");
    expect(robot.style.width).toBe("64px");
    rerender(<AiRobot label="Assistant" size={120} />);
    expect(screen.getByRole("img", { name: "Assistant" }).getAttribute("data-paused")).toBeNull();
  });
  it("uses shared sizes and tone classes and animates each mouth bar", () => {
    const { container, rerender } = render(<AiRobot size="xl" tone="blue" />);
    const robot = container.querySelector("svg")!;
    expect(robot.style.width).toBe("128px");
    expect(robot.getAttribute("class")).toContain("text-blue-500");
    expect(robot.querySelectorAll(".cj-ai-robot-bar")).toHaveLength(6);
    rerender(<AiRobot size={120} tone="rose" />);
    expect(robot.style.width).toBe("120px");
    expect(robot.getAttribute("class")).toContain("text-rose-500");
  });

});
