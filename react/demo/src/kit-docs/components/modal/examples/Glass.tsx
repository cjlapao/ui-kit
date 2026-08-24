import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Glass() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="violet" onClick={() => setIsOpen(true)}>
        Open glass modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="liquid-glass"
        tone="violet"
        title="Liquid glass"
        description="The dialog sits over whatever the page is showing."
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          The see-through surface variants let the app behind stay visible —
          great for quick confirmations on top of rich screens.
        </p>
      </Modal>
    </>
  );
}
