import type { VNodeChild } from "vue";

export interface BottomSheetControls {
  dismiss: () => void;
}

export type BottomSheetRenderable =
  | VNodeChild
  | ((controls: BottomSheetControls) => VNodeChild);

export interface BottomSheetOptions {
  id?: string;
  title?: VNodeChild;
  description?: VNodeChild;
  content?: BottomSheetRenderable;
  actions?: BottomSheetRenderable;
  showCloseButton?: boolean;
  backdropDismiss?: boolean;
  className?: string;
  onClose?: () => void;
}

export interface BottomSheetContextValue {
  presentSheet: (options: BottomSheetOptions) => void;
  dismissSheet: () => void;
  isOpen: boolean;
  currentSheet: BottomSheetOptions | null;
}
