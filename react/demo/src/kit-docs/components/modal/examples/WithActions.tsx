import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function WithActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="soft" color="rose" onClick={() => setIsOpen(true)}>
        Delete project
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        role="alertdialog"
        icon="Warning"
        tone="rose"
        title="Delete acme-inc?"
        description="This cannot be undone. All environments and members are removed."
        actions={
          <>
            <Button
              variant="ghost"
              color="blue"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="rose"
              leadingIcon="Trash"
              onClick={() => setIsOpen(false)}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          The footer actions stay in view no matter how tall the body grows.
        </p>
      </Modal>
    </>
  );
}
