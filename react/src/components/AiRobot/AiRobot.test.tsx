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

  it("renders independently masked solid robots with animated cutouts and the selected tone", () => {
    const { container } = render(<><AiRobot variant="solid" tone="blue" /><AiRobot variant="solid" tone="rose" paused /></>);
    const robots = container.querySelectorAll("svg");
    const masks = container.querySelectorAll("mask");
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    robots.forEach((robot, index) => {
      expect(robot.querySelector(`path[mask="url(#${masks[index].id})"]`)).toBeTruthy();
      expect(robot.querySelector("mask .cj-ai-robot-eyes")).toBeTruthy();
      expect(robot.querySelectorAll(".cj-ai-robot-bar")).toHaveLength(6);
    });
    expect(robots[0].getAttribute("class")).toContain("text-blue-500");
    expect(robots[1].getAttribute("class")).toContain("text-rose-500");
    expect(robots[1].getAttribute("data-paused")).toBe("true");
  });

  it("renders Bip in outline and solid styles with independent masks and shared controls", () => {
    const { container, rerender } = render(<AiRobot identity="bip" tone="rose" size="sm" label="Bip" />);
    const robot = screen.getByRole("img", { name: "Bip" });
    expect(robot.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(robot.getAttribute("class")).toContain("text-rose-500");
    expect(robot.style.width).toBe("48px");
    expect(robot.querySelector(".cj-ai-robot-antenna")).toBeTruthy();
    expect(robot.querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(robot.querySelector("mask")).toBeNull();
    rerender(<><AiRobot identity="bip" variant="solid" paused /><AiRobot identity="bip" variant="solid" /></>);
    const masks = container.querySelectorAll("mask");
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    expect(masks[0].querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("data-paused")).toBe("true");
  });

  it("keeps Bop as the default identity", () => {
    const { container } = render(<AiRobot />);
    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 64 64");
    expect(container.querySelector(".cj-ai-robot-wave")).toBeTruthy();
  });

  it("renders Bit with animated features in both styles and independent solid masks", () => {
    const { container, rerender } = render(<AiRobot identity="bit" tone="teal" size="lg" label="Bit" />);
    const robot = screen.getByRole("img", { name: "Bit" });
    expect(robot.getAttribute("viewBox")).toBe("0 0 15 15");
    expect(robot.getAttribute("class")).toContain("text-teal-500");
    expect(robot.style.width).toBe("96px");
    expect(robot.querySelector(".cj-ai-robot-antenna")).toBeTruthy();
    expect(robot.querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(robot.querySelector(".cj-ai-robot-bit-mouth")).toBeTruthy();
    rerender(<><AiRobot identity="bit" variant="solid" paused /><AiRobot identity="bit" variant="solid" /></>);
    const masks = container.querySelectorAll("mask");
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    expect(masks[0].querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(masks[0].querySelector(".cj-ai-robot-bit-mouth")).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("data-paused")).toBe("true");
  });

  it("renders Hex in both styles with shared controls and independent solid masks", () => {
    const { container, rerender } = render(<AiRobot identity="hex" tone="blue" size="sm" label="Hex" />);
    const robot = screen.getByRole("img", { name: "Hex" });
    expect(robot.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(robot.getAttribute("class")).toContain("text-blue-500");
    expect(robot.style.width).toBe("48px");
    expect(robot.querySelector(".cj-ai-robot-antenna")).toBeTruthy();
    expect(robot.querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(robot.querySelector(".cj-ai-robot-bit-mouth")).toBeTruthy();
    expect(robot.querySelector("mask")).toBeNull();
    rerender(<><AiRobot identity="hex" variant="solid" paused /><AiRobot identity="hex" variant="solid" /></>);
    const masks = container.querySelectorAll("mask");
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    expect(masks[0].querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(masks[0].querySelector(".cj-ai-robot-bit-mouth")).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("data-paused")).toBe("true");
  });

  it("renders Io in both styles with animated eyes and independent solid masks", () => {
    const { container, rerender } = render(<AiRobot identity="io" tone="teal" size="lg" label="Io" />);
    const robot = screen.getByRole("img", { name: "Io" });
    expect(robot.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(robot.getAttribute("class")).toContain("text-teal-500");
    expect(robot.style.width).toBe("96px");
    expect(robot.querySelector(".cj-ai-robot-antenna")).toBeTruthy();
    expect(robot.querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(robot.querySelector("mask")).toBeNull();
    rerender(<><AiRobot identity="io" variant="solid" paused /><AiRobot identity="io" variant="solid" /></>);
    const masks = container.querySelectorAll("mask");
    expect(masks).toHaveLength(2);
    expect(masks[0].id).not.toBe(masks[1].id);
    expect(masks[0].querySelector(".cj-ai-robot-eyes")).toBeTruthy();
    expect(container.querySelectorAll(".cj-ai-robot-io-mouth")).toHaveLength(2);
    expect(container.querySelector("svg")?.getAttribute("data-paused")).toBe("true");
  });

});
