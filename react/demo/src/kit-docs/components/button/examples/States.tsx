import { Button } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>
        Saving…
      </Button>
      <Button disabled>
        Disabled
      </Button>
      <Button variant="soft" color="rose" disabled>
        Disabled soft
      </Button>
    </div>
  );
}
