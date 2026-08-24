import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Button from "./Button";
import IconButton from "./IconButton";
import { IconProvider } from "../contexts/IconContext";

const svgOf = (c: HTMLElement) => c.querySelector("button svg");

describe("icon names resolve without an IconProvider", () => {
  it("renders IconButton's icon from the registry", () => {
    const { container } = render(<IconButton icon="Search" srLabel="Search" />);
    expect(svgOf(container)).not.toBeNull();
  });

  it("renders Button's leading and trailing icons", () => {
    const { container } = render(
      <Button leadingIcon="Search" trailingIcon="Add">
        Find
      </Button>,
    );
    expect(container.querySelectorAll("button svg")).toHaveLength(2);
  });

  it("applies the size class the component asked for", () => {
    const { container } = render(<IconButton icon="Search" size="xl" />);
    // CustomIcon sizes its wrapper; the svg inside just fills it.
    const wrapper = container.querySelector("button > span");
    expect(wrapper!.className).toContain("h-8");
    expect(wrapper!.className).toContain("w-8");
  });

  it("still accepts a React element", () => {
    const { container } = render(
      <IconButton icon={<svg data-testid="custom" />} />,
    );
    expect(svgOf(container)).not.toBeNull();
  });

  it("degrades to a placeholder for an unknown name rather than throwing", () => {
    const { container } = render(<IconButton icon="NotARealIcon" />);
    expect(svgOf(container)).toBeNull();
    expect(container.textContent).toContain("N");
  });

  it("lets IconProvider override the default renderer", () => {
    const { container } = render(
      <IconProvider renderIcon={() => <b data-testid="custom-renderer">x</b>}>
        <IconButton icon="Search" />
      </IconProvider>,
    );
    expect(svgOf(container)).toBeNull();
    expect(container.querySelector("button b")).not.toBeNull();
  });
});
