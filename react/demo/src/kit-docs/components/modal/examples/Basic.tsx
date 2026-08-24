import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Basic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome aboard"
        description="One quick thing before you start."
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Modal traps focus inside the dialog, closes on Escape and on the
          backdrop, and returns focus to the trigger when it closes.
        </p>
      </Modal>
    </>
  );
}
