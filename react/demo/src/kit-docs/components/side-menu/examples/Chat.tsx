import {
  CustomIcon,
  SideMenuLayout,
  type SideMenuItem,
} from "@cjlapao/ui-kit";
import { demoBadge, USER_MENU } from "../demoData";

const CONVERSATIONS: SideMenuItem[] = [
  {
    slug: "alice",
    label: "Alice",
    path: "/chat/alice",
    icon: "User",
    badge: demoBadge("2"),
  },
  { slug: "bob", label: "Bob", path: "/chat/bob", icon: "User" },
  { slug: "design", label: "Design Team", path: "/chat/design", icon: "Users" },
];

export default function Chat() {
  return (
    <div className="h-[26rem] w-full max-w-3xl overflow-hidden rounded-xl bg-white dark:bg-slate-950">
      <SideMenuLayout
        sideMenuProps={{
          title: "Chats",
          color: "violet",
          search: true,
          searchPlaceholder: "Search chats",
          items: CONVERSATIONS,
          footerItem: { label: "Ada Lovelace", icon: "User", menu: USER_MENU },
        }}
        header={
          <header className="flex h-12 items-center gap-3 border-b border-neutral-200 px-5 dark:border-neutral-800">
            <CustomIcon icon="Chat" className="h-4 w-4 text-violet-500" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              Alice
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              online
            </span>
          </header>
        }
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
            <div className="max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              Hey — have you seen the new glass variants?
            </div>
            <div className="max-w-[70%] self-end rounded-2xl bg-violet-500 px-3 py-2 text-sm text-white">
              Just shipped them. Try the Side Menu page.
            </div>
            <div className="max-w-[70%] self-start rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
              The hover rail is a nice touch.
            </div>
          </div>
          <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
            <input
              type="text"
              placeholder="Write a message…"
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-400/60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </SideMenuLayout>
    </div>
  );
}
