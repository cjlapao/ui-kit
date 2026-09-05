import { Button, IconButton, Toolbar } from "@cjlapao/ui-kit";

const start = (
  <>
    <IconButton icon="Add" variant="ghost" srLabel="Add" />
    <IconButton icon="Refresh" variant="ghost" srLabel="Refresh" />
  </>
);

const end = <Button size="sm" leadingIcon="Save">Save</Button>;

/**
 * A toolbar is a sideways Panel, so it takes the shared surface set: the
 * `variant` ladder from invisible `simple` to `liquid-glass`, a `tone` for
 * the tinted ones, and the container `corner` / `padding` scales — the same
 * language the Button inside speaks.
 */
export default function Surface() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Toolbar aria-label="Outlined toolbar" variant="outlined" tone="indigo" start={start} end={end} />
      <Toolbar aria-label="Tonal toolbar" variant="tonal" tone="violet" corner="none" padding="sm" start={start} end={end} />
      <Toolbar aria-label="Elevated toolbar" variant="elevated" corner="rounded-xl" start={start} end={end} />
    </div>
  );
}
