import { Button, Popover } from "@cjlapao/ui-kit";

/**
 * The shared loader language, three ways: a spinner overlay, a progress
 * overlay with a known extent, and a skeleton that replaces the copy — so a
 * slow fetch never flashes empty text.
 */
const LoadingStates = () => (
  <div className="flex flex-wrap items-start justify-center gap-6">
    <div className="flex flex-col items-center gap-1.5">
      <Popover
        trigger={<Button color="blue" size="sm">Spinner</Button>}
        variant="elevated"
        tone="blue"
        loading
        loaderType="spinner"
        loaderTitle="Fetching"
        loaderMessage="Hang tight…"
      >
        <p className="text-xs">Replaced by the spinner overlay.</p>
      </Popover>
      <span className="text-xs opacity-70">spinner overlay</span>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <Popover
        trigger={<Button color="blue" size="sm">Progress</Button>}
        variant="elevated"
        tone="blue"
        loading
        loaderType="progress"
        loaderProgress={64}
        loaderTitle="Fetching"
        loaderMessage="64% done"
      >
        <p className="text-xs">Replaced by the progress overlay.</p>
      </Popover>
      <span className="text-xs opacity-70">progress overlay</span>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <Popover
        trigger={<Button color="blue" size="sm">Skeleton</Button>}
        variant="elevated"
        tone="blue"
        loading
        loaderType="skeleton"
        skeletonLines={3}
      >
        <p className="text-xs">Replaced by the skeleton.</p>
      </Popover>
      <span className="text-xs opacity-70">skeleton body</span>
    </div>
  </div>
);

export default LoadingStates;
