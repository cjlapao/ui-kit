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
export default function IdentityPickerPage() {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
    <PageHeader name="Identity Picker" description="Choose a font-rendered emoji, upload an SVG/PNG image, or create monogram initials. Built from the kit's panels, tabs, search, inputs, buttons and shared upload component." />
    <IdentityPickerPlayground />
    <ExampleCard title="Project identity" description="Returns a discriminated identity value or null on reset. Emoji rendering follows the configured font stack; image files remain local until your app uploads them." code={example} filename="ProjectIdentity.tsx"><div className="w-full max-w-xl"><IdentityPicker name="Project Atlas" defaultValue={{type:"emoji",emoji:"⚡"}} variant="glass" /></div></ExampleCard>
    <PropsTable props={[
      { name: "value / defaultValue / onChange", type: "IdentityValue / IdentityValue / callback", description: "Controlled or internal state: emoji with its Unicode string, image with a File (or persisted src URL), monogram with text, or null. Reset emits null." },
      { name: "compact", type: "boolean", default: "true", description: "Space-saving arrangement: categories beside search, shorter scrollable results, horizontal image dropzone and an inline monogram action. Set false for the roomier category-chip layout. Size still scales all visuals." },
      { name: "name / fontFamily", type: "string / string", description: "Name supplies automatic initials. Font family controls emoji/initial rendering; no fonts or remote emoji images are downloaded." },
      { name: "emojis", type: "IdentityEmoji[]", description: "Optional catalogue of emoji, label, category, keywords and recommended flag. A 128-entry Unicode catalogue is bundled. Emoji rendering uses the system/configured emoji font, independently of the page text font. Search covers all categories; arrow keys move through results." },
      { name: "maxImageSize / onReject", type: "number / callback", default: "5 MB", description: "SVG/PNG only. Invalid types and oversized files produce structured rejections. Preview object URLs are cleaned up; SVG previews use the kit sanitizer." },
      { name: "variant / tone / size / padding / corner", type: "Shared kit scales", description: "Shared surfaces, accents, padding and corners. Size scales preview images/initials, emoji glyphs and tiles, text, spacing, tabs and upload controls together. Glass opacity, vibrancy and specularMode are also available." },
      { name: "disabled / loading / error / labels / uploadLabels", type: "State and copy overrides", description: "Lock interactions, show an error, and localize the identity/upload copy. The app owns persistence and server upload handling." },
    ]} />
  </div>;
}
