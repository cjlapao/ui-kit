import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
import { IdentityPicker } from "@cjlapao/ui-kit";
import { IdentityPickerPlayground } from "./IdentityPickerPlayground";
const example = `<IdentityPicker
  name="Project Atlas"
  defaultValue={{ type: "emoji", emoji: "⚡" }}
  onChange={(identity) => saveIdentity(identity)}
  variant="glass"
  tone="blue"
/>`;
const restrictedExample = `// Emoji-only: no tab bar, and the subtitle stops advertising the hidden kinds.
<IdentityPicker name="Project Atlas" modes={["emoji"]} onChange={saveIdentity} />

// No image storage in this app, so uploads are not offered.
<IdentityPicker name="Project Atlas" modes={["emoji", "monogram"]} onChange={saveIdentity} />`;
export default function IdentityPickerPage() {
  return <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8">
    <PageHeader name="Identity Picker" description="Choose a font-rendered emoji, upload an SVG/PNG image, or create monogram initials. Built from the kit's panels, tabs, search, inputs, buttons and shared upload component." />
    <IdentityPickerPlayground />
    <ExampleCard title="Project identity" description="Returns a discriminated identity value or null on reset. Emoji rendering follows the configured font stack; image files remain local until your app uploads them." code={example} filename="ProjectIdentity.tsx"><div className="w-full max-w-xl"><IdentityPicker name="Project Atlas" defaultValue={{type:"emoji",emoji:"⚡"}} variant="glass" /></div></ExampleCard>
    <ExampleCard title="Restrict the offered modes" description="Offer only the identity kinds your app supports. One mode drops the tab bar entirely and renders that panel on its own; the subtitle follows whatever is offered." code={restrictedExample} filename="WorkspaceIdentity.tsx"><div className="w-full max-w-xl space-y-4"><IdentityPicker name="Project Atlas" modes={["emoji"]} /><IdentityPicker name="Project Atlas" modes={["image", "monogram"]} tone="blue" /></div></ExampleCard>
    <PropsTable props={[
      { name: "value / defaultValue / onChange", type: "IdentityValue / IdentityValue / callback", description: "Controlled or internal state: emoji with its Unicode string, image with a File (or persisted src URL), monogram with text, or null. Reset emits null." },
      { name: "modes", type: "IdentityMode[]", default: "all three", description: "Allowlist of identity kinds to offer — \"emoji\", \"image\", \"monogram\" — shown in the order given, for apps that support fewer than all three. With one mode the tab bar disappears and that panel renders on its own; with none, only the preview and reset remain. Unknown names and duplicates are dropped. A value whose kind is hidden stays visible in the preview and is never re-emitted, and the default subtitle is composed from the offered modes." },
      { name: "compact", type: "boolean", default: "true", description: "Space-saving arrangement: categories beside search, shorter scrollable results, horizontal image dropzone and an inline monogram action. Set false for the roomier category-chip layout. Size still scales all visuals." },
      { name: "name / fontFamily", type: "string / string", description: "Name supplies automatic initials. Font family controls emoji/initial rendering; no fonts or remote emoji images are downloaded." },
      { name: "emojis", type: "IdentityEmoji[]", description: "Optional catalogue of emoji, label, category, keywords and recommended flag. A 128-entry Unicode catalogue is bundled. Emoji rendering uses the system/configured emoji font, independently of the page text font. Search covers all categories; arrow keys move through results." },
      { name: "maxImageSize / onReject", type: "number / callback", default: "5 MB", description: "SVG/PNG only. Invalid types and oversized files produce structured rejections. Preview object URLs are cleaned up; SVG previews use the kit sanitizer." },
      { name: "variant / tone / size / padding / corner / raisedSurface", type: "Shared kit scales / boolean", description: "Shared surfaces, accents, padding and corners. Size scales preview images/initials, emoji glyphs and tiles, text, spacing, tabs and upload controls together. Glass opacity, vibrancy and specularMode are also available. `raisedSurface` forces the first nested-panels depth step on the card — the tinted-card-on-matching-background fix." },
      { name: "disabled / loading / error / labels / uploadLabels", type: "State and copy overrides", description: "Lock interactions, show an error, and localize the identity/upload copy. The app owns persistence and server upload handling." },
    ]} />
  </div>;
}
