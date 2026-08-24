import { Rating } from "@cjlapao/ui-kit";

export default function Vertical() {
  return (
    <div className="flex justify-center">
      <Rating orientation="vertical" defaultValue={3} />
    </div>
  );
}
