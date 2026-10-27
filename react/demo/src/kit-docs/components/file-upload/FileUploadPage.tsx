import { FileUpload } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
import { IdentityPickerPlayground } from "../identity-picker/IdentityPickerPlayground";
export default function FileUploadPage() {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
    <PageHeader name="File Upload" description="A local file-selection component with drag/drop, native browse, validation, image previews and removal. Upload requests stay app-owned. Returns File[] instead of an identity value." />
    <IdentityPickerPlayground fileOnly />
    <ExampleCard title="Multiple attachments" description="Choose files repeatedly to append, or drop a batch. Each rejected file reports its reason; valid files are retained." filename="Attachments.tsx" code={'<FileUpload multiple maxFiles={4} maxSize={5 * 1024 * 1024}\n  onChange={(files) => setAttachments(files)} />'}><div className="w-full max-w-xl"><FileUpload multiple maxFiles={4} maxSize={5 * 1024 * 1024} /></div></ExampleCard>
    <PropsTable props={[
      { name: "value / defaultValue / onChange", type: "File[] / File[] / callback", description: "Controlled or internal local selection. Emits File[] for selection/removal; no automatic network requests." },
      { name: "accept / maxSize / multiple / maxFiles", type: "string / bytes / boolean / number", default: "any / unlimited / false / 20", description: "MIME types, wildcard MIME types or extensions. Single mode replaces the selection; multiple mode appends and respects the count limit." },
      { name: "onReject / rejectionMessage", type: "callback / formatter", description: "Structured rejections include file, code (type/size/count), and message. Override the formatter for localized messages." },
      { name: "compact", type: "boolean", default: "false", description: "Arrange the upload glyph, prompt and browse action in one row. Hides the redundant empty-file caption; selected files and errors remain visible." },
      { name: "embedded", type: "boolean", default: "false", description: "Omit the surrounding Panel when composing the upload control inside another surface, as IdentityPicker does." },
      { name: "preview / labels", type: "boolean / partial labels", default: "true", description: "Optional image previews and copy overrides. Unsupported images use a file icon. Temporary object URLs are revoked when files change or the component unmounts." },
      { name: "variant / tone / size / padding / corner", type: "Shared kit scales", description: "Shared panel surface and control styling, including glass options." },
      { name: "disabled / loading / error", type: "boolean / boolean / ReactNode", description: "Locks browse/drop/remove while disabled or loading. Loading is app-controlled, with errors announced accessibly." },
    ]} />
  </div>;
}
