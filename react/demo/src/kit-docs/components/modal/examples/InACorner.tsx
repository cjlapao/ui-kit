import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function InACorner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open in the bottom right
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Docked to a corner"
        description="Where it sits before any drag."
        size="sm"
        position="bottom-right"
        draggable={false}
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          <code className="font-mono text-xs">position</code> places the dialog
          in any of nine spots. Here dragging is off, so it stays put.
        </p>
      </Modal>
    </>
  );
}
