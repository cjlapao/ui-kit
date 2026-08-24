import { Button, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function AllTones() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Button key={each} variant="solid" color={each}>
          {each}
        </Button>
      ))}
    </div>
  );
}
