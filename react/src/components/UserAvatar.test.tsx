import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import UserAvatar, {
  USER_AVATAR_SHAPES,
  USER_AVATAR_PRESET_SIZES,
} from "./UserAvatar";
import { CONTROL_SIZES, TRUE_COLORS } from "../theme/Theme";

describe("UserAvatar", () => {
  it("has an accessible name", () => {
    // It used to be an unlabelled div; only the happy-path <img> had an alt,
    // so an avatar falling back to an initial was invisible to a reader.
    render(<UserAvatar user={{ name: "Ada Lovelace" }} />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Ada Lovelace");
  });

  it("names itself even with no user at all", () => {
    render(<UserAvatar />);
    expect(screen.getByRole("img")).toHaveAccessibleName("User avatar");
  });

  it("shows the initial when there is no image", () => {
    render(<UserAvatar user={{ name: "ada" }} />);
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("falls back to the initial when the image fails", () => {
    render(
      <UserAvatar user={{ name: "Ada", avatarUrl: "http://x/a.png" }} />,
    );
    const img = document.querySelector("img")!;
    fireEvent.error(img);
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("takes the shared control scale", () => {
    for (const size of CONTROL_SIZES) {
      const { unmount } = render(<UserAvatar user={{ name: "A" }} size={size} />);
      const box = screen.getByRole("img") as HTMLElement;
      expect(box.style.width).not.toBe("");
      unmount();
    }
  });

  it("still accepts an explicit pixel size", () => {
    render(<UserAvatar user={{ name: "A" }} size={64} />);
    expect((screen.getByRole("img") as HTMLElement).style.width).toBe("64px");
  });

  it("tones the fallback chip, instead of a hardcoded slate", () => {
    for (const tone of TRUE_COLORS) {
      const { container, unmount } = render(
        <UserAvatar user={{ name: "A" }} tone={tone} />,
      );
      expect(container.innerHTML).toContain(tone);
      unmount();
    }
    const { container } = render(<UserAvatar user={{ name: "A" }} tone="violet" />);
    expect(container.innerHTML).not.toContain("bg-slate-200");
  });

  it("takes every shape, and the deprecated `variant` alias", () => {
    for (const shape of USER_AVATAR_SHAPES) {
      const { unmount } = render(<UserAvatar user={{ name: "A" }} shape={shape} />);
      expect(screen.getByRole("img")).toBeTruthy();
      unmount();
    }
    const { container } = render(<UserAvatar user={{ name: "A" }} variant="square" />);
    expect(container.innerHTML).toContain("rounded-none");
  });

  // — PrimeVue Avatar parity —

  it("renders a PrimeVue-style label, and names itself with it", () => {
    render(<UserAvatar label="AR" />);
    expect(screen.getByText("AR")).toBeTruthy();
    expect(screen.getByRole("img")).toHaveAccessibleName("AR");
  });

  it("renders an icon from the registry", () => {
    const { container } = render(<UserAvatar icon="User" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("takes the PrimeVue size presets, folded onto the ladder", () => {
    const px: Record<string, string> = {
      normal: "32px",
      large: "40px",
      xlarge: "48px",
    };
    for (const size of USER_AVATAR_PRESET_SIZES) {
      const { unmount } = render(<UserAvatar user={{ name: "A" }} size={size} />);
      expect((screen.getByRole("img") as HTMLElement).style.width).toBe(px[size]);
      unmount();
    }
  });

  it("prefers a direct image over the user's avatarUrl", () => {
    render(
      <UserAvatar
        user={{ name: "Ada", avatarUrl: "http://x/user.png" }}
        image="http://x/direct.png"
      />,
    );
    expect(document.querySelector("img")?.getAttribute("src")).toBe(
      "http://x/direct.png",
    );
  });

  it("keeps PrimeVue's precedence: label over icon over image", () => {
    const { container } = render(
      <UserAvatar label="AR" icon="User" image="http://x/a.png" />,
    );
    expect(screen.getByText("AR")).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).toBeNull();
  });

  it("falls back when the image fails and reports the error, PrimeVue-style", () => {
    const onError = vi.fn();
    render(<UserAvatar user={{ name: "Ada" }} image="http://x/broken.png" onError={onError} />);
    fireEvent.error(document.querySelector("img")!);
    expect(onError).toHaveBeenCalled();
    expect(screen.getByText("A")).toBeTruthy();
  });

  it("lets a template replace the content wholesale", () => {
    render(
      <UserAvatar user={{ name: "Ada Lovelace" }}>
        <span data-testid="template">TMPL</span>
      </UserAvatar>,
    );
    expect(screen.getByTestId("template")).toBeTruthy();
    expect(screen.queryByText("A")).toBeNull();
    // The wrapper still stands for the person.
    expect(screen.getByRole("img")).toHaveAccessibleName("Ada Lovelace");
  });

  it("lets an explicit aria-label override the derived name", () => {
    render(<UserAvatar user={{ name: "Ada Lovelace" }} aria-label="Reviewer" />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Reviewer");
  });
});
