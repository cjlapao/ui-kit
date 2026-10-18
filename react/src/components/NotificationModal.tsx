import React from "react";
import classNames from "classnames";
import Modal, { type ModalProps } from "./Modal";
import Button from "./Button";
import { useSurfaceText } from "../contexts/SurfaceContext";
import { useKitT } from "../i18n";
import { type IconName } from "../icons/registry";
import type { TrueColor } from "../theme/Theme";

/**
 * The kit's shared severity vocabulary is `AlertIntent`
 * (`info | success | warning | danger | neutral`). This component predates it
 * and ships `error` rather than `danger`; the name is kept so call sites are
 * not broken, and the mapping below is the single place the two meet.
 */
export const NOTIFICATION_TYPES = [
  "success",
  "error",
  "warning",
  "info",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationModalProps
  extends Omit<
    ModalProps,
    "children" | "actions" | "icon" | "title" | "tone"
  > {
  title: string;
  message: React.ReactNode;
  /** @default "info" */
  type?: NotificationType;
  /** @default "Close" */
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  /** Override the glyph the `type` would pick. */
  icon?: IconName;
  /** Override the tone the `type` would pick. */
  tone?: TrueColor;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: IconName; tone: TrueColor }
> = {
  // `titleColor` used to be a third field here (`text-emerald-900` and
  // friends). Nothing ever read it, and it had no dark-mode partner.
  success: { icon: "CheckCircle", tone: "emerald" },
  // Was `Warning`, the same glyph as `warning` — so a failure and a caution
  // were indistinguishable at a glance.
  error: { icon: "Error", tone: "rose" },
  warning: { icon: "Warning", tone: "amber" },
  info: { icon: "Info", tone: "blue" },
};

const NotificationModalBody: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Was `text-gray-600` with no dark-mode partner, so the message was
  // near-invisible on a dark modal.
  const text = useSurfaceText();
  return <div className={classNames("text-sm", text.body)}>{children}</div>;
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  icon,
  tone,
  size = "sm",
  ...rest
}) => {
  const t = useKitT();
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;
  const resolvedTone = tone ?? config.tone;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      {...rest}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      tone={resolvedTone}
      icon={icon ?? config.icon}
      actions={
        <Modal.Actions>
          {secondaryActionLabel && (
            <Button
              variant="soft"
              color="slate"
              onClick={onSecondaryAction || onClose}
            >
              {secondaryActionLabel}
            </Button>
          )}
          {/* Was `color={config.color as any}` — the config typed its tone as
              a bare `string`, so the cast was hiding the fact that nothing
              checked it against `TrueColor`. */}
          <Button onClick={handleAction} color={resolvedTone}>
            {actionLabel ?? t("kit.notificationmodal.action")}
          </Button>
        </Modal.Actions>
      }
    >
      <NotificationModalBody>{message}</NotificationModalBody>
    </Modal>
  );
};

export default NotificationModal;
