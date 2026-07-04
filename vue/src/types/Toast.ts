import type { VNodeChild } from "vue";
import { type IconName } from "../icons/registry";

export type ToastType = "success" | "error" | "info" | "warning" | "loading";

export interface ToastAction {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: IconName;
  customIcon?: VNodeChild;
  keepOpen?: boolean;
}

export interface ToastProgress {
  percent: number;
  status: "running" | "paused" | "completed" | "error";
  indeterminate: boolean;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string | VNodeChild;
  duration?: number;
  description?: string;
  label?: string;
  icon?: IconName;
  details?: VNodeChild;
  actions?: ToastAction[];
  channel?: string;
  timestamp: number;
  isRead?: boolean;
  updatedAt?: number;
  _updateTimestamp?: number;
  progress?: ToastProgress;
  autoClose?: boolean;
  autoCloseDuration?: number;
  dismissible?: boolean;
  showIcon?: boolean;
  _remove?: boolean;
}
