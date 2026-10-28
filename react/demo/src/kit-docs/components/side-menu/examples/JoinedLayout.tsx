import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CustomIcon, SideMenuLayout, type SideMenuItem, type SideMenuItemLink } from "@cjlapao/ui-kit";
import { USER_MENU } from "../demoData";

const SECTIONS = [
  { slug: "projects", label: "Projects", icon: "Folder" as const },
  { slug: "activity", label: "Activity", icon: "Calendar" as const },
  { slug: "library", label: "Library", icon: "Library" as const },
  { slug: "home", label: "Home", icon: "Dashboard" as const },
];

const CONTENT: Record<string, string[]> = {
  projects: ["UI kit", "Design system", "Customer portal", "Documentation"],
  activity: ["Panel variants updated", "Workflow rail added", "Design review", "Release prepared"],
  library: ["Components", "Patterns", "Brand assets", "Saved templates"],
  home: [],
};

export default function JoinedLayout() {
  const { pathname } = useLocation();
  const [section, setSection] = useState("projects");
  const [selected, setSelected] = useState("projects-0");
  const [accountAction, setAccountAction] = useState("");
  const [secondaryOpen, setSecondaryOpen] = useState(true);
  const current = SECTIONS.find((item) => item.slug === section)!;
  const railItems: SideMenuItem[] = SECTIONS.map((item) => ({ ...item, path: pathname }));
  const panelItems: SideMenuItemLink[] = CONTENT[section].map((label, index) => ({
    slug: `${section}-${index}`, label, path: pathname,
    icon: section === "projects" ? "Folder" : undefined,
  }));

  return (
    <div className="h-[32rem] w-full max-w-4xl overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <SideMenuLayout
        multiMenuMode="joined"
        secondaryOpen={secondaryOpen}
        onSecondaryOpenChange={setSecondaryOpen}
        sideMenuProps={{
          title: "Workspace navigation",
          responsive: false,
          color: "neutral",
          logoIcon: <CustomIcon icon="Dashboard" className="h-6 w-6" />,
          items: railItems,
          activeItemSlug: section,
          onItemSelect: (item, event) => {
            event.preventDefault();
            setSection(item.slug);
            setSelected(`${item.slug}-0`);
            setSecondaryOpen(true);
          },
          footerItem: {
            label: "Alex Morgan",
            media: <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-neutral-950">AM</span>,
            menu: USER_MENU,
            onSelect: (item) => setAccountAction(String(item.label)),
          },
        }}
        secondarySideMenuProps={section === "home" ? undefined : {
          title: current.label,
          logoText: <span className="text-lg font-semibold">Workspace</span>,
          color: "neutral",
          items: panelItems,
          activeItemSlug: selected,
          onItemSelect: (item, event) => {
            event.preventDefault();
            setSelected(item.slug);
          },
          search: true,
          searchPlaceholder: `Search ${current.label.toLowerCase()}`,
          ctas: [{
            slug: "explore-library",
            title: "Make it yours",
            description: "One workspace, two levels of navigation.",
            action: { label: "Explore library", onClick: () => { setSection("library"); setSelected("library-0"); } },
          }],
        }}
        header={<div className="flex items-center justify-between gap-3 px-6 py-4 text-xs text-neutral-600 dark:text-neutral-400">
          <span>Workspace / {current.label}</span>
          {section !== "home" && <button type="button" onClick={() => setSecondaryOpen(value => !value)}
            aria-expanded={secondaryOpen}
            className="rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 dark:hover:bg-white/10">
            {secondaryOpen ? "Hide navigation" : "Show navigation"}
          </button>}
        </div>}
      >
        <div className="space-y-4 p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{current.label}</p>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{panelItems.find((item) => item.slug === selected)?.label ?? "Welcome home"}</h3>
          <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">Choose Home to use the app without secondary navigation, or toggle navigation above. The app expands into the available space while the rounded corners remain beside the rail. Escape inside the secondary menu also closes it.</p>
          {accountAction && <p role="status" className="text-sm text-neutral-500">Account action: {accountAction}</p>}
        </div>
      </SideMenuLayout>
    </div>
  );
}
