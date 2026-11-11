import { useState } from "react";
import { CodeBlock } from "@cjlapao/ui-kit";

export function EditCode() {
  const [value, setValue] = useState('{\n  "theme": "blue",\n  "readOnly": false\n}');
  return <div className="grid w-full min-w-0 gap-4"><CodeBlock filename="settings.json" language="json" readOnly={false} value={value} onChange={setValue} /><CodeBlock filename="Live preview" language="json" value={value} /></div>;
}

