import { Button } from "@cjlapao/ui-kit";

const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;

export default function Active() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {VARIANTS.map((each) => (
        <Button key={each} variant={each} active>
          {each}
        </Button>
      ))}
    </div>
  );
}
