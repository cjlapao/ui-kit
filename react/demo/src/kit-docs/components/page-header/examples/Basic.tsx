import { Breadcrumb, PageHeader } from "@cjlapao/ui-kit";
import { Button, IconButton } from "@cjlapao/ui-kit";

/**
 * The bar across the top of the main column: a brand and a breadcrumb trail
 * on the left, page controls on the right. Same region anatomy as the
 * `Toolbar`, but the furniture of a page — and it paints the shell's own
 * header chrome rather than a Panel variant, so its bottom edge continues
 * whatever line the sidebar draws.
 */
export default function Basic() {
  return (
    <PageHeader
      aria-label="Example page header"
      start={
        <>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            ui-kit
          </span>
          <Breadcrumb
            ariaLabel="Example breadcrumb"
            items={[{ label: "Docs", to: "#" }, { label: "Getting started", current: true }]}
          />
        </>
      }
      end={
        <>
          <IconButton icon="Search" variant="ghost" srLabel="Search" />
          <Button size="sm" leadingIcon="Settings" variant="soft">
            Configure
          </Button>
        </>
      }
    />
  );
}
