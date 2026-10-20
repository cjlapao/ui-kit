import { Button, CustomIcon, PageHeader, SideMenu } from "@cjlapao/ui-kit";
import type { PageHeaderVariant } from "@cjlapao/ui-kit";
import { DEMO_ITEMS } from "../../side-menu/demoData";

const shellFrame =
  "h-80 w-full max-w-3xl overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950";

// Spelled as literals so the Tailwind scanner can see them.
const LOGO_TINT = { blue: "text-blue-500", emerald: "text-emerald-500" } as const;

function PairedShell({
  variant,
  tone,
}: {
  variant: Extract<PageHeaderVariant, "floating" | "floating-glass">;
  tone: "blue" | "emerald";
}) {
  return (
    <div className={shellFrame}>
      <div className="flex h-full">
        <SideMenu
          fullHeight
          variant={variant}
          color={tone}
          logoIcon={
            <CustomIcon icon="UX" className={`h-6 w-6 ${LOGO_TINT[tone]}`} />
          }
          logoText={
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              ui-kit
            </span>
          }
          items={DEMO_ITEMS}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <PageHeader
            aria-label={`Example ${variant} shell header`}
            variant={variant}
            accentColor={tone}
            start={
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Reports <span className="mx-1 text-neutral-300">/</span>
                <span className="text-neutral-900 dark:text-neutral-50">
                  Quarterly
                </span>
              </span>
            }
            end={
              <Button size="sm" leadingIcon="Download" variant="soft">
                Export
              </Button>
            }
          />
          <div className="flex-1 space-y-3 p-6">
            <div className="h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="h-14 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The detached pairing: `SideMenu` and `PageHeader` set to the same
 * treatment read as one card system — the menu carries the shared `m-2`
 * inset and the header's gutter defaults decompose it (the same spacing
 * above and to its right, flush left and bottom), and both draw the same
 * corner, rim and shadow. The header card matches the menu's logo-header
 * card height (`h-15`); in the glass pair the frosted tints match through
 * the shared tone.
 */
export default function FloatingShell() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <PairedShell variant="floating" tone="blue" />
      <PairedShell variant="floating-glass" tone="emerald" />
    </div>
  );
}
