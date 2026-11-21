import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import SlugInput from "./SlugInput";

afterEach(cleanup);

// The field box carries `.group` (see Input.tsx); the component root is the
// flex column that stacks box → slug line → notes.
const root = (container: HTMLElement) => container.firstElementChild!;

describe("SlugInput", () => {
  it("renders the derived slug line under the field box", () => {
    const { container } = render(<SlugInput defaultValue="Hello, World!" />);
    const children = Array.from(root(container).children);

    expect(children[0]).toHaveClass("group");
    const slug = screen.getByText("hello_world");
    expect(slug).toHaveAttribute("data-slug");
    expect(children.indexOf(slug)).toBeGreaterThan(children.indexOf(children[0]));
  });

  it("updates the slug on every keystroke", () => {
    render(<SlugInput />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "My New Post!" } });

    expect(screen.getByText("my_new_post")).toHaveAttribute("data-slug");
  });

  it("calls onValueChange with the value and the freshly derived slug", () => {
    const onValueChange = vi.fn();
    render(<SlugInput onValueChange={onValueChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello, World!" },
    });

    expect(onValueChange).toHaveBeenCalledWith("Hello, World!", "hello_world");
  });

  it("still calls the consumer's own onChange", () => {
    const onChange = vi.fn();
    render(<SlugInput onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "abc" },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("hides the slug line for an empty value, before and after typing", () => {
    const { container } = render(<SlugInput />);
    expect(container.querySelector("[data-slug]")).toBeNull();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(container.querySelector("[data-slug]")).not.toBeNull();

    // Clearing it again must pull the line back — a stale slug from an
    // emptied title is worse than no slug.
    fireEvent.change(input, { target: { value: "" } });
    expect(container.querySelector("[data-slug]")).toBeNull();
  });

  it("hides the slug line when showSlug is false", () => {
    const { container } = render(
      <SlugInput defaultValue="Hello, World!" showSlug={false} />,
    );
    expect(container.querySelector("[data-slug]")).toBeNull();
  });

  it("stacks slug above the validation notes", () => {
    const { container } = render(
      <SlugInput defaultValue="Hello, World!" helpText="Some help" error="Boom" />,
    );
    const children = Array.from(root(container).children);

    expect(children[0]).toHaveClass("group"); // the Input box
    expect(children[1]).toHaveAttribute("data-slug");
    expect(children[2]).toHaveTextContent("Boom");
    expect(children[2]).toHaveTextContent("Some help");
  });

  it("styles the error note rose and marks the input invalid", () => {
    render(<SlugInput defaultValue="x" error="Required." />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Required.")).toHaveClass("text-rose-600");
  });

  it("lets a custom slugify replace the algorithm entirely", () => {
    render(
      <SlugInput
        defaultValue="Hello, World!"
        slugifyOptions={{ separator: "-" }}
        slugify={(v) => v.toUpperCase()}
      />,
    );

    expect(screen.getByText("HELLO, WORLD!")).toHaveAttribute("data-slug");
  });

  it("honours slugifyOptions over the defaults", () => {
    render(<SlugInput defaultValue="Hello, World!" slugifyOptions={{ separator: "-" }} />);
    expect(screen.getByText("hello-world")).toHaveAttribute("data-slug");
  });

  it("prefixes the slug line with slugLabel", () => {
    render(<SlugInput defaultValue="Hello, World!" slugLabel="Slug:" />);
    expect(screen.getByText("Slug: hello_world")).toHaveAttribute("data-slug");
  });

  it("renders the built-in id: label when slugLabel is true", () => {
    render(<SlugInput defaultValue="Hello, World!" slugLabel />);
    expect(screen.getByText("id: hello_world")).toHaveAttribute("data-slug");
  });

  it("has no prefix at all by default, or with a blank string", () => {
    const { rerender } = render(<SlugInput defaultValue="Hello, World!" />);
    expect(screen.getByText("hello_world")).toHaveAttribute("data-slug");

    rerender(<SlugInput defaultValue="Hello, World!" slugLabel="   " />);
    expect(screen.getByText("hello_world")).toHaveAttribute("data-slug");
  });

  it("derives the slug line from a controlled value", () => {
    render(<SlugInput value="Some Title" onChange={() => {}} />);
    expect(screen.getByText("some_title")).toHaveAttribute("data-slug");
  });

  it("wires aria-describedby to the slug and note elements", () => {
    render(<SlugInput defaultValue="Hello, World!" error="Boom" id="title" />);

    const described = screen
      .getByRole("textbox")
      .getAttribute("aria-describedby");
    expect(described).toContain("title-slug");
    expect(described).toContain("title-error");
  });

  it("passes ordinary Input props through to the control", () => {
    render(<SlugInput placeholder="Type a title" size="lg" tone="emerald" />);
    expect(screen.getByPlaceholderText("Type a title")).toBeInTheDocument();
  });
});
