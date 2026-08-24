import { SideMenu } from "@cjlapao/ui-kit";
import { MINI_ITEMS, USER_MENU, WORKSPACE_MENU } from "../demoData";

export default function TopFooter() {
  return (
    <div className="h-96 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="indigo"
          title="Menus"
          topItem={{ label: "ACME Corp", icon: "Users", menu: WORKSPACE_MENU }}
          footerItem={{ label: "Ada Lovelace", icon: "User", menu: USER_MENU }}
          items={MINI_ITEMS}
        />
        <div className="flex-1 space-y-3 p-6">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            The top row opens a workspace switcher; the footer row is pinned
            above the collapse control with the user menu.
          </p>
          <div className="h-16 rounded-lg bg-white/40 dark:bg-neutral-800/40" />
        </div>
      </div>
    </div>
  );
}
