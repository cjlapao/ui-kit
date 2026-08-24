import { Rating } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3} disabled />
    </div>
  );
}
