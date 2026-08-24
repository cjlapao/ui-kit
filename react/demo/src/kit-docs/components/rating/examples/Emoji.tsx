import { Rating } from "@cjlapao/ui-kit";

const FACES = ["😡", "😕", "😐", "🙂", "😍"];

export default function Emoji() {
  return (
    <div className="flex justify-center">
      <Rating
        size="lg"
        defaultValue={3}
        onIcon={(index) => (
          <span className="flex items-center justify-center text-2xl">
            {FACES[index - 1]}
          </span>
        )}
        offIcon={(index) => (
          <span className="flex items-center justify-center text-2xl opacity-40 grayscale">
            {FACES[index - 1]}
          </span>
        )}
      />
    </div>
  );
}
