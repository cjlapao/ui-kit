import { Button, CustomIcon, PageHeader, SideMenu } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../../side-menu/demoData";

/**
 * The pairing the component exists for: `SideMenu`'s logo header and the
 * page header paint the same seam constants — `h-15`, `border-gray-200`
 * (`dark:border-neutral-700`), `bg-white` (`dark:bg-neutral-900`) — so the
 * horizontal line runs across the whole shell in one stroke. Change either
 * component and this example is where you would see the break.
 */
export default function WithSideMenu() {
  return (
    <div className="h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
      <div className="flex h-full">
        <SideMenu
          fullHeight
          color="blue"
          logoIcon={<CustomIcon icon="UX" className="h-6 w-6 text-blue-500" />}
          logoText={
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              ui-kit
            </span>
          }
          items={DEMO_ITEMS}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader
            aria-label="Example shell header"
            start={
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Reports <span className="mx-1 text-neutral-300">/</span>
                <span className="text-neutral-900 dark:text-neutral-50">Quarterly</span>
              </span>
            }
            end={
              <Button size="sm" leadingIcon="Download" variant="soft">
                Export
              </Button>
            }
          />
          <div className="flex-1 space-y-3 p-6">
            <div className="h-24 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
