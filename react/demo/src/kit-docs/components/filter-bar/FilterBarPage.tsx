import { FilterBar } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { PropsTable } from "../../shared/A11ySections";
import { ExampleCard } from "../../shared/ExampleCard";
import Controlled from "./examples/Controlled";
import controlledCode from "./examples/Controlled.tsx?raw";
import { FilterBarPlayground } from "./FilterBarPlayground";

export default function FilterBarPage() {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="Filter Bar" description="Expandable search, staged checkbox filters, removable chips and a live result summary. Built from SearchBar, Menu, Button and Badge with the kit’s shared spring motion." />
    <FilterBarPlayground />
    <section className="space-y-4"><h2 className="text-lg font-semibold">Reference states</h2><p className="text-sm text-neutral-500">Start with collapsed search. Click Search to expand, Add filter to see categories, then Status to select options. Done adds the chip; click its label to edit or its × to remove.</p>
      <FilterBar searchProps={{ onSearch: () => {}, initialValue: "MacBook", autoSearch: false }} filters={[]} filteredCount={1} totalCount={5} itemLabel="devices" />
      <FilterBar searchProps={{ onSearch: () => {} }} filters={[{ id: "status", label: "Status", options: [{ value: "online", label: "Online", count: 3 }, { value: "offline", label: "Offline", count: 2 }] }]} defaultValue={{ status: ["online"] }} filteredCount={3} totalCount={5} itemLabel="devices" />
    </section>
    <ExampleCard title="Controlled filtering" description="The consumer owns the dataset, search and filter state. Copy this complete example." code={controlledCode} filename="Controlled.tsx"><Controlled /></ExampleCard>
    <PropsTable props={[
      { name: "searchProps", type: "SearchBarProps", description: "Existing search API: onSearch(query, signal?), debounceMs, autoSearch, initialValue, shouldClear, onClear, loading and all search styles. Search stays mounted while collapsed." },
      { name: "filters", type: "FilterBarFilter[]", description: "Categories with unique id, label, optional count/disabled and options with value, label, optional count/disabled. Zero counts remain selectable." },
      { name: "value / defaultValue / onChange", type: "FilterBarValue / (value) => void", description: "Record of category IDs to selected option values. Done commits the draft. Back, Escape or outside click discards it. Chip removal and Clear all commit immediately. Clear all preserves search." },
      { name: "filteredCount / totalCount / itemLabel", type: "number / number / string", description: "Caller supplies result counts and filters its own data. The demo uses OR within a category and AND across categories." },
      { name: "showSearch / showFilterLabel / showEmptyState", type: "boolean", default: "true", description: "Toggle the search control, Filters heading/icon and empty-selection message independently. Hiding search preserves its query and active filtering." },
      { name: "showClearAll / showResultCount / showMenuCounts", type: "boolean", default: "true", description: "Toggle Clear all, the trailing filtered/total summary (including its divider), and category/option counts in menus. Hidden parts leave no reserved space; filter state and callbacks stay unchanged. Use showResultCount={false} to hide the counts at the end." },
      { name: "variant / tone / corner / padding", type: "SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding", default: "outlined / neutral / rounded-sm / xs", description: "Shared container styling, using the same tokens as Panel and Toolbar. The none variant adds no surface border. Padding uses the shared container scale, including none." },
      { name: "transparency / glassOpacity / vibrancy", type: "SurfaceTransparency / GlassOpacity / GlassVibrancy", default: "auto / frosted / medium", description: "Shared surface transparency. Glass opacity and vibrancy customize the liquid-glass surface. For glass previews, enable the playground background." },
      { name: "buttonVariant / secondaryButtonVariant / applyButtonVariant", type: "ButtonVariant", default: "outline / ghost / solid", description: "Style Add filter, secondary actions (Clear all, Back, Clear) and Done independently. Search and chip-removal controls retain their icon treatment." },
      { name: "buttonTone / buttonSize / buttonCorner / buttonWeight / buttonDashed", type: "TrueColor / ControlSize / SurfaceCorner / ButtonWeight / boolean", default: "color / size / default shapes / normal / true", description: "Shared action-button styling. Tone and corner also apply to the search trigger and chip-removal buttons. Chip-removal buttons retain their compact size. Dashed affects only the outline Add filter button." },
      { name: "menuVariant / menuTone / menuCorner / menuPadding", type: "SurfaceVariant / SurfaceTone / SurfaceCorner / SurfacePadding", default: "outlined / none / menu default / xs", description: "Style the filter popup independently of the bar. Popup padding follows Menu’s compact inset scale." },
      { name: "chipVariant / chipTone", type: "BadgeVariant / TrueColor", default: "soft / color", description: "Style applied-filter chips independently of the surface and action buttons." },
      { name: "size / color / spring", type: "ControlSize / TrueColor / ControlSpring", default: "md / blue / snappy", description: "Shared control size, search/chip accent, and spring animation. Search-specific overrides, including variant and color, remain in searchProps. Motion respects reduced-motion preferences." },
      { name: "disabled / className / aria-label", type: "boolean / string / string", description: "Disable interaction, style the root, or name the filter region." },
    ]} />
    <p className="text-sm text-neutral-500">Keyboard: Enter or Space opens controls. Menu arrows, Home, End and typeahead navigate options. ArrowLeft returns to categories; Escape cancels and restores focus. Tab reaches Clear and Done. Labels use the kit translation catalog.</p>
  </div>;
}
