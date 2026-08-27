import { useState } from "react";
import { NotificationModal, NOTIFICATION_TYPES, Button } from "@cjlapao/ui-kit";
import type { NotificationType } from "@cjlapao/ui-kit";

/**
 * Each type picks a glyph and a tone. `error` and `warning` used to share the
 * `Warning` glyph, so a failure and a caution looked identical.
 *
 * Note: the kit's shared severity vocabulary is `AlertIntent`
 * (`info | success | warning | danger | neutral`); this component predates it
 * and ships `error` rather than `danger`.
 */
export default function Types() {
  const [open, setOpen] = useState<NotificationType | null>(null);
  return (
    <div className="flex flex-wrap gap-2">
      {NOTIFICATION_TYPES.map((type) => (
        <Button key={type} variant="soft" onClick={() => setOpen(type)}>
          {type}
        </Button>
      ))}
      {open && (
        <NotificationModal
          isOpen
          onClose={() => setOpen(null)}
          type={open}
          title={`This is a ${open} notification`}
          message="The message takes its colour from the surface it sits on."
        />
      )}
    </div>
  );
}
