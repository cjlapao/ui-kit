import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
import { MenuPlayground } from "./MenuPlayground";
import MenuExamples from "./MenuExamples";
import code from "./MenuExamples.tsx?raw";
export default function MenuPage() {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
    <PageHeader name="Menu" description="Command and navigation menus with groups, inline expansion, cascading submenus, checkbox/radio selection, and positioned popups. Uses the kit's shared panel surfaces, tone, size, padding and corners." />
    <MenuPlayground />
    <ExampleCard title="Menus for commands, preferences and accounts" description="Hover or use Right Arrow to open a tiered submenu. Use Up/Down, Home/End and typeahead to navigate; Left Arrow returns to the parent, Escape closes and restores focus. Checkbox/radio items stay open by default." code={code} filename="MenuExamples.tsx"><MenuExamples /></ExampleCard>
    <PropsTable props={[
      { name: "items", type: "MenuItem[]", description: "Unique id, label/textValue, icon, description, badge, shortcut, trailing content, disabled/hidden/danger, command, to or href. items nests children; content supplies expandable details." },
      { name: "submenuMode", type: '"inline" | "tiered"', default: "inline", description: "Expand children inside the menu or in viewport-aware cascading overlays." },
      { name: "trigger / anchorRef / popup", type: "ReactElement / Ref / boolean", description: "A trigger or anchor enables popup mode. The trigger is cloned with open state and keyboard controls. An external anchor is controlled with open/onOpenChange." },
      { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / callback", description: "Controlled or internal popup state. Outside clicks dismiss without stealing focus; Escape restores trigger focus." },
      { name: "expandedKeys / defaultExpandedKeys / onExpandedKeysChange", type: "string[] / string[] / callback", description: "Controlled or internal expanded inline section ids." },
      { name: "type / checked / onCheckedChange", type: '"item" | "group" | "separator" | "checkbox" | "radio" | "section"', description: "Item kinds. Checked state and radio exclusivity are consumer-controlled. Check/radio items stay open; override with closeOnSelect." },
      { name: "variant / tone / corner / padding / size", type: "Shared kit scales", default: "outlined / neutral / theme / xs / md", description: "Shared surface and content scales; padding uses the compact menu scale (xs: p-1 sm:p-1.5). Glass opacity, vibrancy and specularMode are also supported." },
      { name: "itemTone / itemPadding / itemCorner", type: "TrueColor / SurfacePadding / SurfaceCorner", default: "surface tone / follows size / rounded-sm", description: "Independent item defaults. Each MenuItem can override these with tone, padding, and corner. Danger styling stays semantic." },
      { name: "header / footer / renderItem", type: "ReactNode / ReactNode / callback", description: "Custom account chrome and row content. Row rendering preserves the command target, semantics and keyboard behavior." },
      { name: "placement / width / maxHeight", type: "Side / number|string / number", default: "bottom / 256 / 400", description: "Popup placement and dimensions; overlays flip and clamp at viewport edges, follow scrolling and stack above their anchors." },
    ]} />
  </div>;
}
