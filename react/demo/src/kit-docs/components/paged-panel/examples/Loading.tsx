import { PagedPanel, PAGED_PANEL_LOADERS } from "@cjlapao/ui-kit";

const PAGES = [<p key="1" className="text-sm">eu-west-1</p>];

/**
 * The kit's three loader treatments, `skeleton` by default.
 *
 * The skeleton is shaped like a page rather than being a generic block, so the
 * panel keeps its real height and nothing jumps when the data lands. The
 * header stays put in every case — a paged panel that collapses to a bare
 * spinner loses its nav and its position.
 *
 * `PagedPanel` owns this rather than delegating to `Panel`: in `bare` mode
 * there is no Panel at all, so that path previously had no loading treatment.
 */
export default function Loading() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {PAGED_PANEL_LOADERS.map((loaderType) => (
        <PagedPanel
          key={loaderType}
          pages={PAGES}
          title={loaderType}
          loading
          loaderType={loaderType}
          progress={40}
          loadingLabel={loaderType === "progress" ? "40%" : undefined}
        />
      ))}
    </div>
  );
}
