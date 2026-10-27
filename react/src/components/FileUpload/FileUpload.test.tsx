import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FileUpload from "./FileUpload";
import { ImagePreview } from "./ImagePreview";
const png = (name = "logo.png") => new File(["image"], name, { type: "image/png" });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("FileUpload", () => {
  it("selects through the native input, resets it for same-file selection, and removes files", () => {
    const onChange = vi.fn();
    render(<FileUpload onChange={onChange} />);
    const input = screen.getByLabelText("Choose files") as HTMLInputElement;
    const file = png();
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenLastCalledWith([file]);
    expect(input.value).toBe("");
    expect(screen.getByText("logo.png")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove logo.png" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
  it("appends valid files and reports type, size and count rejections independently", () => {
    const onChange = vi.fn(); const onReject = vi.fn();
    render(<FileUpload multiple accept="image/*" maxSize={10} maxFiles={2} defaultValue={[png("first.png")]} onChange={onChange} onReject={onReject} />);
    const valid = png("second.png");
    fireEvent.drop(screen.getByLabelText("Drop files here"), { dataTransfer: { files: [new File(["text"], "note.txt", {type:"text/plain"}), new File(["longer-than-ten-bytes"], "huge.png", {type:"image/png"}), valid, png("third.png")] } });
    expect(onChange.mock.calls[0][0].map((file: File) => file.name)).toEqual(["first.png", "second.png"]);
    expect(onReject.mock.calls[0][0].map((item: {code: string}) => item.code)).toEqual(["type", "size", "count"]);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
  it("replaces single selections and preserves them after cancellation or rejection", () => {
    const onChange = vi.fn(); render(<FileUpload accept="image/*" defaultValue={[png("first.png")]} onChange={onChange} />);
    const file = png("replacement.png");
    const input = screen.getByLabelText("Choose files");
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenLastCalledWith([file]);
    fireEvent.change(input, { target: { files: [] } });
    fireEvent.change(input, { target: { files: [new File(["text"], "bad.txt", {type:"text/plain"})] } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText("replacement.png")).toBeInTheDocument();
  });
  it("handles file-item drops and embedded mode without a nested surface", () => {
    const onChange = vi.fn();
    const { container } = render(<FileUpload embedded onChange={onChange} />);
    const image = png();
    fireEvent.drop(screen.getByRole("group", {name:"Drop files here"}), { dataTransfer: { files: [], items: [{kind:"file", getAsFile: () => image}] } });
    expect(onChange).toHaveBeenCalledWith([image]);
    expect(container.querySelector("section")).toBeNull();
  });
  it("keeps controlled selections with their owner", () => {
    const onChange = vi.fn(); render(<FileUpload value={[]} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Choose files"), { target: { files: [png()] } });
    expect(onChange).toHaveBeenCalled();
    expect(screen.queryByText("logo.png")).toBeNull();
  });
  it.each([{ disabled: true }, { loading: true }])("blocks selection and drop when locked: %o", state => {
    const onChange = vi.fn(); render(<FileUpload {...state} onChange={onChange} />);
    fireEvent.drop(screen.getByLabelText("Drop files here"), { dataTransfer: {files: [png()]} });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Choose files")).toBeDisabled();
  });
  it("accepts extension rules with empty MIME values", () => {
    const onChange = vi.fn(); render(<FileUpload accept=".png" onChange={onChange} />);
    const file = new File(["image"], "LOGO.PNG");
    fireEvent.change(screen.getByLabelText("Choose files"), { target: {files: [file]} });
    expect(onChange).toHaveBeenCalledWith([file]);
  });
  it("cleans up object URLs on replacement and unmount", async () => {
    const create = vi.fn().mockReturnValueOnce("blob:one").mockReturnValueOnce("blob:two");
    const revoke = vi.fn();
    vi.stubGlobal("URL", class extends URL { static createObjectURL = create; static revokeObjectURL = revoke; });
    const { rerender, unmount } = render(<ImagePreview file={png()} alt="Logo" />);
    await waitFor(() => expect(screen.getByRole("img", {name:"Logo"})).toHaveAttribute("src", "blob:one"));
    rerender(<ImagePreview file={png("next.png")} alt="Logo" />);
    await waitFor(() => expect(revoke).toHaveBeenCalledWith("blob:one"));
    unmount(); expect(revoke).toHaveBeenCalledWith("blob:two");
    vi.unstubAllGlobals();
  });
  it("sanitizes SVG content before making a preview URL", async () => {
    const create = vi.fn().mockReturnValue("blob:safe");
    vi.stubGlobal("URL", class extends URL { static createObjectURL = create; static revokeObjectURL = vi.fn(); });
    const file = new File([], "logo.svg", {type:"image/svg+xml"});
    Object.defineProperty(file, "text", { value: async () => '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle r="4" /></svg>' });
    const {unmount} = render(<ImagePreview file={file} alt="Logo" />);
    await waitFor(() => expect(create).toHaveBeenCalled());
    expect(create.mock.calls[0][0]).toBeInstanceOf(Blob);
    unmount(); vi.unstubAllGlobals();
  });
});
