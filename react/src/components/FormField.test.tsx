import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormField from "./FormField";
import FormLayout from "./FormLayout";
import FormSection from "./FormSection";
import { CONTROL_SIZES, getSurfaceTextTokens } from "../theme/Theme";

describe("FormField — label association", () => {
  it("associates the label with the control even without a description", () => {
    // The child was only cloned when there was something to describe, so a
    // plain field's `htmlFor` pointed at an id that existed nowhere.
    render(
      <FormField label="First name">
        <input type="text" />
      </FormField>,
    );

    expect(screen.getByLabelText("First name")).toBe(
      screen.getByRole("textbox"),
    );
  });

  it("still associates when a description is present", () => {
    render(
      <FormField label="Email" description="Only for notices">
        <input type="text" />
      </FormField>,
    );
    const control = screen.getByRole("textbox");

    expect(screen.getByLabelText("Email")).toBe(control);
    expect(control.getAttribute("aria-describedby")).toContain("description");
  });

  it("respects an explicit labelFor", () => {
    render(
      <FormField label="Custom" labelFor="my-id">
        <input type="text" />
      </FormField>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "my-id");
  });
});

describe("FormField — validation", () => {
  it("marks the control invalid when an error is given, without a second prop", () => {
    // `validationStatus` used to have to be set separately, so a field could
    // show an error message while reporting itself as valid.
    render(
      <FormField label="Email" error="Required">
        <input type="text" />
      </FormField>,
    );

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("does not mark it invalid on success", () => {
    render(
      <FormField label="Email" validationStatus="success" hint="Looks good">
        <input type="text" />
      </FormField>,
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByText("Looks good").className).toContain("emerald");
  });

  it("prefers the error over the hint", () => {
    render(
      <FormField label="X" hint="hint text" error="error text">
        <input type="text" />
      </FormField>,
    );
    expect(screen.queryByText("hint text")).toBeNull();
    expect(screen.getByText("error text")).toBeInTheDocument();
  });
});

describe("FormField — sizing", () => {
  it("accepts the whole shared control scale", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(
        <FormField label="L" size={size}>
          <input type="text" />
        </FormField>,
      );
      expect(screen.getByText("L").className).toMatch(/text-(xs|sm|base|lg)/);
      unmount();
    }
  });
});

describe("FormLayout", () => {
  it("aligns rows to the start by default", () => {
    // It used to force items-center for any multi-column layout, dragging
    // neighbouring labels out of line.
    const { container } = render(
      <FormLayout columns={2}>
        <div />
      </FormLayout>,
    );
    const grid = container.firstElementChild as HTMLElement;

    expect(grid.className).toContain("items-start");
    expect(grid.className).toContain("sm:grid-cols-2");
  });

  it("supports four columns and the shared gap scale", () => {
    const { container } = render(
      <FormLayout columns={4} gap="xl" align="center">
        <div />
      </FormLayout>,
    );
    const grid = container.firstElementChild as HTMLElement;

    expect(grid.className).toContain("lg:grid-cols-4");
    expect(grid.className).toContain("gap-x-10");
    expect(grid.className).toContain("items-center");
  });
});

describe("FormSection", () => {
  it("renders header, body and footer", () => {
    render(
      <FormSection title="Account" description="Public" footer={<span>Save</span>}>
        <span>body</span>
      </FormSection>,
    );

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("takes Panel's surfaces", () => {
    const { container } = render(
      <FormSection variant="glass" tone="slate">
        <span>body</span>
      </FormSection>,
    );
    const panel = container.querySelector("section") as HTMLElement;

    expect(panel.dataset.variant).toBe("glass");
    expect(panel.dataset.tone).toBe("slate");
  });

  it("switches the dividers to a light hairline on a translucent surface", () => {
    const { container } = render(
      <FormSection variant="liquid-glass" title="T" footer={<span>f</span>}>
        <span>body</span>
      </FormSection>,
    );
    // A solid neutral rule on glass reads as a line drawn on top of it.
    expect(container.querySelector(".border-white\\/30")).not.toBeNull();
  });
});

describe("Surface-aware text", () => {
  it("darkens muted copy on a translucent surface", () => {
    // On glass over a photo the light end of the neutral scale disappears, so
    // hints and "optional" markers were invisible while labels still read.
    const solid = getSurfaceTextTokens("elevated");
    const glass = getSurfaceTextTokens("liquid-glass");

    expect(solid.muted).toContain("text-neutral-500");
    expect(glass.muted).toContain("text-neutral-700");
    expect(glass.translucent).toBe(true);
    expect(glass.divider).toContain("border-white/30");
  });

  it("gives fields inside a glass FormSection the darker copy", () => {
    render(
      <FormSection variant="liquid-glass">
        <FormField label="Name" optionalLabel="Optional">
          <input type="text" />
        </FormField>
      </FormSection>,
    );
    expect(screen.getByText("Optional").className).toContain("text-neutral-700");
  });

  it("leaves fields on a solid surface alone", () => {
    render(
      <FormSection variant="elevated">
        <FormField label="Name" optionalLabel="Optional">
          <input type="text" />
        </FormField>
      </FormSection>,
    );
    expect(screen.getByText("Optional").className).toContain("text-neutral-500");
  });
});
