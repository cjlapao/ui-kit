import { Rating } from "@cjlapao/ui-kit";

export default function CustomIcons() {
  return (
    <div className="flex justify-center">
      <Rating onIcon="Praise" offIcon="Praise" defaultValue={3} />
    </div>
  );
}
