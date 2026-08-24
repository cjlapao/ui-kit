import { Textarea } from "@cjlapao/ui-kit";
import type { TextareaResize } from "@cjlapao/ui-kit";

const modes: TextareaResize[] = ["none", "vertical", "horizontal", "both"];

export default function ResizeModes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {modes.map((resize) => (
        <Textarea
          key={resize}
          size="sm"
          resize={resize}
          label={resize}
          placeholder="Drag the corner to resize"
        />
      ))}
    </div>
  );
}
