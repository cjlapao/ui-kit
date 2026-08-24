import { useState } from "react";
import { Button, Rating } from "@cjlapao/ui-kit";

export default function Controlled() {
  const [value, setValue] = useState(4);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Rating value={value} allowHalf onChange={setValue} />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue(2.5)}>
          2.5
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(3)}>
          3
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(3.5)}>
          3.5
        </Button>
      </div>
    </div>
  );
}
