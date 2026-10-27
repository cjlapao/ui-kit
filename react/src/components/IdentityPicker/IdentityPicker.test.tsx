import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import IdentityPicker from "./IdentityPicker";
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
  for (const item of IDENTITY_EMOJIS) expect(screen.getByRole("button", { name: item.label })).toBeInTheDocument();
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


it("switches compact arrangements without losing selected identity", () => {
  const {rerender} = render(<IdentityPicker />);
  expect(screen.getByRole("combobox", {name:"Emoji categories"})).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", {name:"Rocket"}));
  rerender(<IdentityPicker compact={false} />);
  expect(screen.queryByRole("combobox", {name:"Emoji categories"})).toBeNull();
  expect(screen.getByRole("button", {name:"Recommended"})).toBeInTheDocument();
  expect(screen.getByRole("img", {name:"Identity preview: 🚀"})).toBeInTheDocument();
});
