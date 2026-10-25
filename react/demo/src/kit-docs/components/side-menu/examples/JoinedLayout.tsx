import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CustomIcon, SideMenuLayout, type SideMenuItem, type SideMenuItemLink } from "@cjlapao/ui-kit";
import { USER_MENU } from "../demoData";

const SECTIONS = [
  { slug: "projects", label: "Projects", icon: "Folder" as const },
  { slug: "activity", label: "Activity", icon: "Calendar" as const },
  { slug: "library", label: "Library", icon: "Library" as const },
];

const CONTENT: Record<string, string[]> = {
  projects: ["UI kit", "Design system", "Customer portal", "Documentation"],
  activity: ["Panel variants updated", "Workflow rail added", "Design review", "Release prepared"],
  library: ["Components", "Patterns", "Brand assets", "Saved templates"],
};

export default function JoinedLayout() {
  const { pathname } = useLocation();
  const [section, setSection] = useState("projects");
  const [selected, setSelected] = useState("projects-0");
  const [accountAction, setAccountAction] = useState("");
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
          },
          footerItem: {
            label: "Alex Morgan",
            media: <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-[10px] font-semibold text-neutral-950">AM</span>,
            menu: USER_MENU,
            onSelect: (item) => setAccountAction(String(item.label)),
          },
        }}
        secondarySideMenuProps={{
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
        header={<div className="px-6 py-4 text-xs text-neutral-500">Workspace / {current.label}</div>}
      >
        <div className="space-y-4 p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">{current.label}</p>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{panelItems.find((item) => item.slug === selected)?.label}</h3>
          <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">Choose an icon to switch sections. The rail stays compact while the adjoining menu stays open.</p>
          {accountAction && <p role="status" className="text-sm text-neutral-500">Account action: {accountAction}</p>}
        </div>
      </SideMenuLayout>
    </div>
  );
}
