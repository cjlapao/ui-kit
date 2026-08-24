import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Maximized() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open maximized
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Full-screen review"
        description="Opens filling the viewport."
        showMaximized
        showMaximizeButton
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The dialog fills the screen. The restore button in the header puts
            it back to its normal size without closing it.
          </p>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
            image: ghcr.io/acme/orchestrator-api:2.14.0
            <br />
            sha256:9f2c…e41d
          </div>
        </div>
      </Modal>
    </>
  );
}
