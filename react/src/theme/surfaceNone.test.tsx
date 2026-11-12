import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DEFAULT_SURFACE_TONE, SURFACE_VARIANTS, getPanelToneStyles, getSurfaceVariantClasses, getSurfaceAccentColor, type SurfaceTone } from "./Theme";
import { getSurfaceGlassFillClass } from "./glass";
import Accordion from "../components/Accordion";
import CollapsiblePanel from "../components/CollapsiblePanel";
import CodeBlock from "../components/CodeBlock";
import FormSection from "../components/FormSection";

describe("Untinted shared surfaces", () => {
  it("provides a distinct untinted surface tone without changing real palette colors", () => {
    expect(DEFAULT_SURFACE_TONE).toBe("none");
    expect(SURFACE_VARIANTS).toContain("none");
    expect(getSurfaceAccentColor("none")).toBe("neutral");
    expect(getSurfaceAccentColor("blue")).toBe("blue");
    expect(getSurfaceVariantClasses("none", "none")).toBe("");
    expect(getSurfaceVariantClasses("none", "blue")).toContain("--color-blue-50");
    expect(getPanelToneStyles("none").tonalBg).not.toContain("--color-blue-50");
    expect(getSurfaceGlassFillClass("none", "frosted")).not.toContain("bg-none");
  });

  it.each(["none", "rose"] as const)("forwards %s through representative wrappers", (tone: SurfaceTone) => {
    const { container } = render(<div>
      <Accordion tone={tone} variant="none" items={[]} />
      <CollapsiblePanel tone={tone} variant="none" title="Details">Content</CollapsiblePanel>
      <FormSection tone={tone} variant="none">Fields</FormSection>
      <CodeBlock tone={tone} variant="none" value="const n = 1;" />
    </div>);
    const panels = container.querySelectorAll('section[data-variant="none"]');
    expect(panels).toHaveLength(4);
    panels.forEach(panel => expect(panel).toHaveAttribute("data-tone", tone));
    expect(container.innerHTML).not.toContain("bg-none-");
    expect(container.innerHTML).not.toContain("text-none-");
  });
});
