import { Input, Picker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", title: "api-gateway", subtitle: "eu-west-1" },
  { id: "b", title: "worker-pool", subtitle: "us-east-1" },
];

/**
 * Every state comes from the shared field system, so a Picker and an Input
 * side by side agree on all of them — the surface, the padding, the error
 * border, the disabled treatment.
 *
 * The loading row is the one that used to be wrong: the spinner and copy had
 * no `flex-1` between them, so the chevron sat against the word "Loading…"
 * instead of at the trailing edge where every other state puts it.
 *
 * `loading` also disables the trigger — there is nothing to pick yet, and
 * opening onto an empty list reads as "no results" rather than "not ready". It
 * takes a wait cursor rather than the disabled dim, because the spinner
 * already says why the control is inert.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Loading (trigger disabled)</span>
        <Picker items={[]} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Disabled</span>
        <Picker items={ITEMS} selectedId="a" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Error</span>
        <Picker items={ITEMS} validationStatus="error" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">Beside an Input</span>
        <Picker items={ITEMS} selectedId="a" />
        <Input placeholder="Same size, same variant" />
      </div>
    </div>
  );
}
