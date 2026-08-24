import { Rating } from "@cjlapao/ui-kit";

export default function StarCount() {
  return (
    <div className="flex justify-center">
      <Rating stars={10} defaultValue={6} />
    </div>
  );
}
