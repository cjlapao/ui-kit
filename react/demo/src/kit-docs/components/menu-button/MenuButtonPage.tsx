import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PropsTable } from "../../shared/A11ySections";
import { MenuButtonPlayground } from "./MenuButtonPlayground";
import MenuButtonExamples from "./MenuButtonExamples";
import code from "./MenuButtonExamples.tsx?raw";

export default function MenuButtonPage() {
  return <div className="space-y-6">
    <PageHeader name="Menu Button" description="A Button trigger with icon, stacked title/subtitle, trailing pill and caret, wired to a rich Menu popup — the model-picker pattern. Selection is one prop: selectedKey renders the right-aligned check on the chosen row at any depth and echoes a selected descendant on its submenu parent. Popups always collide-detect: they flip to the free side, clamp to the viewport and cap their height to the space left, scrolling internally." />
    <MenuButtonPlayground />
    <ExampleCard title="Complex scenarios" description="The Claude-style model picker (subtitle rows, badge pills, submenu header notes, plan footer), a settings mode switcher (groups, separators, shortcuts, switch toggles, danger) and deeply nested tiered menus — including a bottom-right trigger demonstrating the flip and internal scroll." code={code} filename="MenuButtonExamples.tsx"><MenuButtonExamples /></ExampleCard>
    <PropsTable title="MenuButton props" props={[
      { name: "icon", type: "IconName | ReactElement", description: "Leading glyph, drawn through the Button's leadingIcon slot and its icon renderer." },
      { name: "title / subtitle", type: "ReactNode", description: "The stacked trigger lines — bold first line, muted second. Title also names the popup menu." },
      { name: "pill", type: "ReactNode | { label, ...PillProps }", description: "The compact value pill after the text block. The config form maps onto Pill (tone, variant, icon…); a ReactNode renders verbatim." },
      { name: "caret / caretIcon", type: "boolean / string | ReactElement", default: "true / ArrowDown", description: "The trailing chevron, pinned to the right edge of the trigger whatever the alignment. All Button vocabulary — variant, color, size, weight, glass, tooltip, tooltipPosition, tooltipDelay — passes through. While the menu is open the trigger keeps its hover paint (so a ghost picker still reads as the thing you pressed) and its tooltip stands down, both without a prop to remember." },
      { name: "align", type: '"left" | "center" | "right"', default: "left", description: "How the title and subtitle sit inside the trigger. Only the copy moves: the text column is the flexible child, so the pill and caret hold the right edge in all three. Needs `width`/`maxWidth` to give it room — at content width there is nothing to align within." },
      { name: "width / maxWidth", type: "number | string", default: "— / —", description: "CSS width of the trigger — a number is px, a string any CSS length. The stacked title and subtitle ellipsize inside it instead of pushing the icon, pill and caret outside, so a column of pickers keeps one clean edge; pair it with `menuWidth=\"trigger\"` to floor the popup at the trigger's own width. Applied as an inline style over your own `style`. The DOM `width` attribute is dropped, so this is the only width that reaches the button." },
      { name: "items / selectedKey / submenuMode …", type: "MenuItem[] / string / inline | tiered", default: "— / — / tiered", description: "Passed straight to Menu: rows carry icons, descriptions, badges, shortcuts and nested items (a tiered popup by default); selectedKey drives the right-aligned check (menuitemradio) and the parent-row value echo. Lists with no icons drop the leading glyph gutter." },
      { name: "menuWidth / menuMaxWidth / menuMaxHeight / menuPlacement", type: "number | string / number / number / Side", default: "256 / 380 / 400 / bottom", description: "Popup dimensions and preferred side. `menuWidth` floors the popup, `menuMaxWidth` caps how far long rows may widen it (the viewport clamp rides on top). Collision handling is always on: side flip, viewport clamp, and a height cap to the space left on the chosen side." },
      { name: "menuVariant / menuTone / menuPadding / menuCorner …", type: "Panel vocabulary", description: "The Menu surface, mirrored from MenuProps with the menu prefix (DropdownButton precedent) so Button names never collide." },
      { name: "menuHeader / menuFooter / renderItem …", type: "ReactNode / callback", description: "Menu chrome pass-throughs, including open/defaultOpen/onOpenChange/onSelect and expanded-key control." },
    ]} />
    <PropsTable title="Menu additions (selection)" props={[
      { name: "selectedKey", type: "string", description: "Id of the selected row at any depth. It renders the right-aligned check and menuitemradio + aria-checked semantics; checkbox/radio rows keep their own left-side checks." },
      { name: "Value echo", type: "automatic", description: "When the selection lives inside a submenu, its parent row shows the selected entry's text right-aligned before the chevron — unless an explicit trailing is provided." },
      { name: "submenuHeader", type: "ReactNode", description: "Muted note rendered above a parent's submenu list — the model picker's \"Higher effort means…\" copy. Root menus keep using header/footer." },
      { name: "type: \"toggle\"", type: "checked / onCheckedChange", description: "Checkbox semantics (menuitemcheckbox, stays open on select) drawn as a trailing presentational switch in the kit Toggle's treatment — the row stays a single button, so the switch mirrors state and the row owns the keyboard." },
      { name: "closeOnSelect", type: "boolean", default: "depth-aware", description: "Menu-wide default for the per-item flag. Unset, submenu rows collapse their branch and keep the menu open (focus returns to the opening row); explicit true closes the whole menu at any depth, false keeps the root list open while submenus still collapse on select." },
    ]} />
  </div>;
}
