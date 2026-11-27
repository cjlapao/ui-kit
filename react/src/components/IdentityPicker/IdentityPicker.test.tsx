import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IdentityPicker, { type IdentityMode } from "./IdentityPicker";
import { IDENTITY_EMOJIS } from "./emojis";

describe("IdentityPicker", () => {
  it("selects an emoji and resets to automatic initials", () => {
    const onChange = vi.fn(); render(<IdentityPicker name="Project Atlas" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", {name:"Rocket"}));
    expect(onChange).toHaveBeenLastCalledWith({type:"emoji",emoji:"🚀"});
    expect(screen.getByRole("button", {name:"Rocket"})).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", {name:"Reset"}));
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(screen.getByRole("img", {name:"Identity preview: PA"})).toBeInTheDocument();
  });
  it("searches outside the selected category and supports custom emoji catalogues", async () => {
    render(<IdentityPicker emojis={[{emoji:"🧪", label:"Test tube",category:"Science", keywords:["experiment"]}]} />);
    expect(screen.getByRole("button", {name:"Test tube"})).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Search emoji/), {target:{value:"experiment"}});
    await waitFor(() => expect(screen.getByRole("button", {name:"Test tube"})).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Search emoji/), {target:{value:"not found"}});
    await waitFor(() => expect(screen.getByText("No emoji match your search.")).toBeInTheDocument());
  });
  it("edits monograms and emits image File values", () => {
    const onChange = vi.fn(); render(<IdentityPicker name="Project Atlas" onChange={onChange} />);
    fireEvent.click(screen.getByRole("tab", {name:"Monogram"}));
    fireEvent.change(screen.getByRole("textbox", {name:"Initials"}), {target:{value:"ui"}});
    expect(onChange).toHaveBeenLastCalledWith({type:"monogram",text:"UI"});
    fireEvent.click(screen.getByRole("tab", {name:"Upload image"}));
    const file = new File(["image"], "logo.png", {type:"image/png"});
    fireEvent.change(screen.getByLabelText("Choose files"), {target:{files:[file]}});
    expect(onChange).toHaveBeenLastCalledWith({type:"image",file});
  });
  it("accepts dropped images inside the upload tab and rejects non-images", () => {
    const onChange = vi.fn(); const onReject = vi.fn();
    render(<IdentityPicker onChange={onChange} onReject={onReject} />);
    fireEvent.click(screen.getByRole("tab", { name: "Upload image" }));
    const target = screen.getByRole("group", { name: "Drop an image here" });
    const image = new File(["image"], "dropped.png", { type: "image/png" });
    fireEvent.drop(target, { dataTransfer: { files: [image] } });
    expect(onChange).toHaveBeenLastCalledWith({ type: "image", file: image });
    fireEvent.drop(target, { dataTransfer: { files: [new File(["text"], "note.txt", { type: "text/plain" })] } });
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({code:"type"})]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  it("honors controlled values and rejects unsupported image files", () => {
    const onChange = vi.fn(); const onReject = vi.fn();
    render(<IdentityPicker value={{type:"emoji",emoji:"⚡"}} onChange={onChange} onReject={onReject} />);
    fireEvent.click(screen.getByRole("button", {name:"Rocket"}));
    expect(screen.getByRole("button", {name:"Lightning"})).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("tab", {name:"Upload image"}));
    fireEvent.change(screen.getByLabelText("Choose files"), {target:{files:[new File(["text"],"text.txt",{type:"text/plain"})]}});
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({code:"type"})]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  it("gives multiple instances distinct accessible tab identities", () => {
    const { container } = render(<><IdentityPicker name="One" /><IdentityPicker name="Two" /></>);
    const ids = Array.from(container.querySelectorAll("[role=tab]")).map(tab => tab.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tab of container.querySelectorAll("[role=tab][aria-selected=true]")) {
      expect(container.querySelector(`[id="${tab.getAttribute("aria-controls")}"]`)).not.toBeNull();
    }
  });
  it("renders persisted images and locks interactions when disabled", () => {
    const onChange = vi.fn(); render(<IdentityPicker value={{type:"image",src:"https://example.com/logo.png"}} disabled onChange={onChange} />);
    expect(screen.getByRole("img", {name:"Identity preview"})).toHaveAttribute("src", "https://example.com/logo.png");
    expect(screen.getByRole("button", {name:"Reset"})).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });
});


it("offers the entire 128-entry catalogue through All and search", async () => {
  expect(IDENTITY_EMOJIS).toHaveLength(128);
  expect(new Set(IDENTITY_EMOJIS.map(item => item.emoji)).size).toBe(128);
  render(<IdentityPicker />);
  fireEvent.change(screen.getByRole("combobox", { name: "Emoji categories" }), {target:{value:"all"}});
  // One query, not 128 accessible-tree walks: the claim is the same set
  // comparison, and at full-suite load the per-entry getByRole exceeded the
  // default 5s ceiling (it passes in isolation in ~1.5s).
  const names = new Set(
    screen.getAllByRole("button").map((button) => button.getAttribute("aria-label")),
  );
  for (const item of IDENTITY_EMOJIS) expect(names.has(item.label)).toBe(true);
  expect(screen.getByRole("button", { name: "Rocket" })).toHaveClass("h-10", "text-xl");
  fireEvent.change(screen.getByPlaceholderText(/Search emoji/), { target: { value: "butterfly" } });
  await waitFor(() => expect(screen.getByRole("button", { name: "Butterfly" })).toBeInTheDocument());
  await waitFor(() => expect(screen.queryByRole("button", { name: "Rocket" })).toBeNull());
});


it("resizes previews, emoji glyphs and upload controls without resetting selection", () => {
  const { rerender } = render(<IdentityPicker size="xs" />);
  fireEvent.click(screen.getByRole("button", { name: "Rocket" }));
  expect(screen.getByRole("img", { name: "Identity preview: 🚀" })).toHaveClass("h-8", "w-8");
  expect(screen.getByRole("button", { name: "Rocket" })).toHaveClass("h-7", "text-sm");
  rerender(<IdentityPicker size="xl" />);
  expect(screen.getByRole("img", { name: "Identity preview: 🚀" })).toHaveClass("h-24", "w-24");
  expect(screen.getByRole("button", { name: "Rocket" })).toHaveClass("h-14", "text-3xl");
  expect(screen.getByRole("button", { name: "Rocket" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("tab", { name: "Upload image" }));
  expect(screen.getByRole("group", { name: "Drop an image here" })).toHaveClass("p-6");
  rerender(<IdentityPicker size="xs" />);
  expect(screen.getByRole("group", { name: "Drop an image here" })).toHaveClass("p-2");
});


it("detaches the preview from the component size through iconSize", () => {
  render(<IdentityPicker name="Project Atlas" size="sm" iconSize="lg" />);
  expect(screen.getByRole("img", { name: "Identity preview: PA" })).toHaveClass("h-20", "w-20", "text-4xl");
  // The card's furniture stays on the component ladder — only the avatar grew.
  expect(screen.getByRole("button", { name: "Rocket" })).toHaveClass("h-8", "text-base");
});


it("scales the monogram and emoji previews with iconSize alike", () => {
  render(<IdentityPicker defaultValue={{ type: "monogram", text: "AB" }} size="xs" iconSize="xl" />);
  expect(screen.getByRole("img", { name: "Identity preview: AB" })).toHaveClass("h-24", "w-24", "text-5xl");
  fireEvent.click(screen.getByRole("tab", { name: "Emoji picker" }));
  fireEvent.click(screen.getByRole("button", { name: "Rocket" }));
  expect(screen.getByRole("img", { name: "Identity preview: 🚀" })).toHaveClass("h-24", "w-24", "text-5xl");
});


it("sheds the preview chrome for an image identity when bareImagePreview is set", () => {
  render(<IdentityPicker value={{ type: "image", src: "https://example.com/logo.png" }} tone="blue" bareImagePreview />);
  // The image fills the card's tone and the hairline frames it — both belong to the glyph case.
  const box = screen.getByRole("img", { name: "Identity preview" }).parentElement!;
  expect(box).not.toHaveClass("border");
  expect(box).not.toHaveClass("border-neutral-200");
  expect(box).not.toHaveClass("bg-blue-50");
  // Bare is not shapeless: the size token, the clipping and the corner stay the component's.
  expect(box).toHaveClass("h-16", "w-16", "overflow-hidden", "rounded-2xl");
});


it("keeps the preview chrome on an image identity until the app asks for bare", () => {
  render(<IdentityPicker value={{ type: "image", src: "https://example.com/logo.png" }} tone="blue" />);
  const box = screen.getByRole("img", { name: "Identity preview" }).parentElement!;
  expect(box).toHaveClass("border");
  expect(box).toHaveClass("border-neutral-200");
  expect(box).toHaveClass("bg-blue-50");
});


it("keeps the glyph chrome under bareImagePreview, because the tint is what seats an emoji", () => {
  render(<IdentityPicker value={{ type: "emoji", emoji: "⚡" }} tone="blue" bareImagePreview />);
  const box = screen.getByRole("img", { name: "Identity preview: ⚡" });
  expect(box).toHaveClass("border", "border-neutral-200", "bg-blue-50");
});


it("switches compact arrangements without losing selected identity", () => {
  const {rerender} = render(<IdentityPicker />);
  expect(screen.getByRole("combobox", {name:"Emoji categories"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", {name:"Rocket"}));
  rerender(<IdentityPicker compact={false} />);
  expect(screen.queryByRole("combobox", {name:"Emoji categories"})).toBeNull();
  expect(screen.getByRole("button", {name:"Recommended"})).toBeInTheDocument();
  expect(screen.getByRole("img", {name:"Identity preview: 🚀"})).toBeInTheDocument();
});

describe("IdentityPicker modes", () => {
  it("still offers all three kinds and their subtitle by default", () => {
    render(<IdentityPicker />);
    expect(screen.getAllByRole("tab").map(tab => tab.textContent?.trim())).toEqual(["Emoji picker", "Upload image", "Monogram"]);
    expect(screen.getByText("Choose an emoji, upload an image, or use monogram initials.")).toBeInTheDocument();
  });
  it("drops the tab bar entirely when a single mode remains", () => {
    const onChange = vi.fn();
    render(<IdentityPicker modes={["emoji"]} onChange={onChange} />);
    expect(screen.queryByRole("tab")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Rocket" }));
    expect(onChange).toHaveBeenLastCalledWith({ type: "emoji", emoji: "🚀" });
    expect(screen.getByText("Choose an emoji.")).toBeInTheDocument();
  });
  // A filtered-out panel is never handed to Tabs, so its controls leave the document
  // instead of sitting around hidden behind an inactive tab.
  it("renders only the dropzone when image is the only offered mode", () => {
    render(<IdentityPicker modes={["image"]} />);
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByRole("group", { name: "Drop an image here" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Rocket" })).toBeNull();
    expect(screen.queryByPlaceholderText(/Search emoji/)).toBeNull();
    expect(screen.queryByRole("textbox", { name: "Initials" })).toBeNull();
  });
  it("renders only the initials field when monogram is the only offered mode", () => {
    render(<IdentityPicker modes={["monogram"]} />);
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByRole("textbox", { name: "Initials" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Choose files")).toBeNull();
    expect(screen.queryByRole("button", { name: "Rocket" })).toBeNull();
  });
  it("keeps exactly the two offered tabs", () => {
    render(<IdentityPicker modes={["emoji", "monogram"]} />);
    expect(screen.getAllByRole("tab").map(tab => tab.textContent?.trim())).toEqual(["Emoji picker", "Monogram"]);
    expect(screen.queryByRole("tab", { name: "Upload image" })).toBeNull();
    expect(screen.queryByLabelText("Choose files")).toBeNull();
    expect(screen.getByText("Choose an emoji or use monogram initials.")).toBeInTheDocument();
  });
  it("follows the order of the modes array", () => {
    render(<IdentityPicker modes={["monogram", "emoji"]} />);
    expect(screen.getAllByRole("tab").map(tab => tab.textContent?.trim())).toEqual(["Monogram", "Emoji picker"]);
  });
  it("collapses duplicate and unknown mode names", () => {
    render(<IdentityPicker modes={["emoji", "emoji", "hologram"] as IdentityMode[]} />);
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByRole("button", { name: "Rocket" })).toBeInTheDocument();
  });
  it("keeps the preview and reset when no modes are offered", () => {
    render(<IdentityPicker name="Project Atlas" modes={[]} />);
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.getByRole("img", { name: "Identity preview: PA" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeEnabled();
    expect(screen.queryByText(/Choose an emoji/)).toBeNull();
  });
  it("keeps a value outside the allowed modes visible and never emits it", () => {
    const onChange = vi.fn();
    render(<IdentityPicker value={{ type: "image", src: "https://example.com/logo.png" }} modes={["emoji"]} onChange={onChange} />);
    expect(screen.getByRole("img", { name: "Identity preview" })).toHaveAttribute("src", "https://example.com/logo.png");
    expect(screen.queryByRole("tab")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
  it("falls back to the first offered tab when the value names a hidden mode", () => {
    render(<IdentityPicker value={{ type: "monogram", text: "PA" }} modes={["emoji", "image"]} />);
    expect(screen.getByRole("tab", { name: "Emoji picker" })).toHaveAttribute("aria-selected", "true");
    expect(screen.queryByRole("tab", { name: "Monogram" })).toBeNull();
  });
  it("still opens on the tab matching the value when that mode is offered", () => {
    render(<IdentityPicker value={{ type: "monogram", text: "PA" }} />);
    expect(screen.getByRole("tab", { name: "Monogram" })).toHaveAttribute("aria-selected", "true");
  });
  it("lets an app override the composed subtitle", () => {
    render(<IdentityPicker modes={["emoji"]} labels={{ description: "Pick a glyph." }} />);
    expect(screen.getByText("Pick a glyph.")).toBeInTheDocument();
    expect(screen.queryByText(/Choose an emoji/)).toBeNull();
  });
});

describe("three hues, three owners", () => {
  // The combination the two props exist for — a neutral card holding white
  // fields that still focus blue. Asserted on rendered classes, because the
  // entire question is which element ends up wearing which hue.
  const classes = (el: Element) => (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
  const wearing = (hue: string) => Array.from(document.body.querySelectorAll<HTMLElement>("[class]")).filter(
    (el) => classes(el).some((token) => /(^|:)focus/.test(token) && new RegExp(`(?:border|ring|outline)-${hue}-400`).test(token)));

  it("paints the fields with inputFillTone and their states with inputTone, leaving the card's furniture on tone", () => {
    render(<IdentityPicker name="Project Atlas" modes={["emoji"]} tone="emerald" inputTone="blue" inputFillTone="neutral" />);
    // Both fields: the search bar and the category select.
    const fields = wearing("blue");
    expect(fields.length).toBeGreaterThanOrEqual(2);
    // Neither field leaks the card's accent into its own classes...
    for (const field of fields) expect(classes(field).filter((token) => token.includes("emerald"))).toEqual([]);
    // ...while the fill really did come over (neutral is the variant's own rest,
    // which for `flat` is a white box, not a grey one).
    for (const field of fields) expect(classes(field)).toContain("bg-white");
    // And the furniture — tabs, chips, tiles, preview — is still emerald.
    expect(Array.from(document.body.querySelectorAll<HTMLElement>("[class]")).flatMap(classes).some((token) => token.includes("emerald"))).toBe(true);
  });

  it("keeps the fields on the card's accent when inputTone is not given", () => {
    render(<IdentityPicker name="Project Atlas" modes={["emoji"]} tone="emerald" />);
    expect(wearing("emerald").length).toBeGreaterThanOrEqual(2);
    expect(wearing("blue")).toEqual([]);
  });
});
