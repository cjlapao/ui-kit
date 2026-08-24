import { useState } from "react";
import { Alert, Button } from "@cjlapao/ui-kit";

export default function WithActions() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Alert
        intent="danger"
        variant="subtle"
        title="Deployment failed"
        description="Build 482 exited with a non-zero status."
        dismissible
        open={open}
        onDismiss={() => setOpen(false)}
        actions={
          <Button size="xs" variant="solid" color="blue">
            View logs
          </Button>
        }
      />
      {!open && (
        <Button
          size="xs"
          variant="outline"
          color="blue"
          onClick={() => setOpen(true)}
        >
          Show alert again
        </Button>
      )}
    </div>
  );
}
