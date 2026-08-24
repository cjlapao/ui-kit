import { Rating } from "@cjlapao/ui-kit";

export default function ReadOnly() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3.5} allowHalf readOnly />
    </div>
  );
}
