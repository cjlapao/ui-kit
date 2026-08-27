import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import PasswordInput from "./PasswordInput";
import Input from "./Input";
import { CONTROL_SIZES, INPUT_VARIANTS } from "../theme/Theme";

describe("PasswordInput", () => {
  it("starts masked and reveals on the toggle", () => {
    const { container } = render(<PasswordInput aria-label="Secret" />);
    const field = container.querySelector("input")!;
    expect(field.getAttribute("type")).toBe("password");
    fireEvent.click(screen.getByLabelText("Show password"));
    expect(field.getAttribute("type")).toBe("text");
    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(field.getAttribute("type")).toBe("password");
  });

  it("can be controlled", () => {
    const onRevealedChange = vi.fn();
    const { container } = render(
      <PasswordInput revealed onRevealedChange={onRevealedChange} />,
    );
    expect(container.querySelector("input")!.getAttribute("type")).toBe("text");
    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(onRevealedChange).toHaveBeenCalledWith(false);
    // Still controlled: it did not flip itself.
    expect(container.querySelector("input")!.getAttribute("type")).toBe("text");
  });

  it("drops the toggle when not revealable", () => {
    render(<PasswordInput revealable={false} />);
    expect(screen.queryByLabelText("Show password")).toBeNull();
  });

  it("drops the toggle on a disabled or read-only field", () => {
    // It used to stay live there, so a disabled password could still be read.
    const { unmount } = render(<PasswordInput disabled />);
    expect(screen.queryByLabelText("Show password")).toBeNull();
    unmount();
    render(<PasswordInput readOnly />);
    expect(screen.queryByLabelText("Show password")).toBeNull();
  });

  describe("behaves exactly like Input", () => {
    it("renders the same field markup as a bare Input at the same settings", () => {
      // The only intended differences are the type and the reveal button.
      const { container: pw, unmount } = render(
        <PasswordInput size="lg" variant="elevated" tone="violet" revealable={false} />,
      );
      const pwClass = pw.querySelector("input")!.className;
      unmount();
      const { container: plain } = render(
        <Input size="lg" variant="elevated" tone="violet" type="password" />,
      );
      expect(pwClass).toBe(plain.querySelector("input")!.className);
    });

    it("carries the validation treatment through", () => {
      // The status is painted on the field *wrapper*, not the <input>, so
      // compare the rendered tree rather than the input's own class list.
      const { container: err, unmount } = render(
        <PasswordInput validationStatus="error" />,
      );
      const errHtml = err.innerHTML;
      unmount();
      const { container: none } = render(<PasswordInput />);
      expect(errHtml).not.toBe(none.innerHTML);
      expect(errHtml).toMatch(/rose|red/);
    });

    it("forwards native attributes and the ref", () => {
      const ref = { current: null as HTMLInputElement | null };
      const { container } = render(
        <PasswordInput
          ref={ref}
          placeholder="Secret"
          autoComplete="current-password"
          name="pw"
        />,
      );
      const field = container.querySelector("input")!;
      expect(field.getAttribute("placeholder")).toBe("Secret");
      expect(field.getAttribute("autocomplete")).toBe("current-password");
      expect(field.getAttribute("name")).toBe("pw");
      expect(ref.current).toBe(field);
    });

    it("takes every input variant", () => {
      for (const variant of INPUT_VARIANTS) {
        const { container, unmount } = render(<PasswordInput variant={variant} />);
        expect(container.querySelector("input")).not.toBeNull();
        unmount();
      }
    });
  });

  it("uses a registry glyph that scales with the field", () => {
    // The icon was a raw component with a hardcoded `w-4 h-4`, so it stayed
    // 16px at every size and bypassed the kit's icon renderer.
    for (const size of CONTROL_SIZES) {
      const { container, unmount } = render(<PasswordInput size={size} />);
      expect(container.innerHTML).not.toContain("w-4 h-4");
      unmount();
    }
  });
});
