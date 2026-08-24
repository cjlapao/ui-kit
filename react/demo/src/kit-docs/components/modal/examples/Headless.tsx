import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Headless() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open headless dialog
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Headless"
        headless
        ariaLabel="Headless example"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The header is dropped entirely — no title, no close button, no drag
            handle. The dialog has to provide its own way out.
          </p>
          <Button
            variant="solid"
            color="blue"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
