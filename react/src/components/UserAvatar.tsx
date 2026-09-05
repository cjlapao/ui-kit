import { useState, useEffect, type ReactElement, type ReactNode } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import { type IconName } from "../icons/registry";
import {
  getPillColorClasses,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";

export const USER_AVATAR_SHAPES = ["circle", "rounded", "square"] as const;
export type UserAvatarShape = (typeof USER_AVATAR_SHAPES)[number];

/**
 * PrimeVue Avatar's size names, accepted alongside the shared control ladder
 * so a `size="large"` avatar drops straight in from a PrimeVue codebase.
 */
export const USER_AVATAR_PRESET_SIZES = ["normal", "large", "xlarge"] as const;
export type UserAvatarPresetSize = (typeof USER_AVATAR_PRESET_SIZES)[number];

/** Control ladder rung, PrimeVue preset name, or an exact pixel box. */
export type UserAvatarSize = ControlSize | UserAvatarPresetSize | number;

export interface UserAvatarUser {
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
}

export interface UserAvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color"> {
  user?: UserAvatarUser | null;
  /**
   * Scale on the shared control ladder. Was a bare pixel number, so an avatar
   * could not be told to match the `sm` Button beside it. A number still
   * works and wins, for the call sites that need an exact box; PrimeVue's
   * `normal` / `large` / `xlarge` are mapped onto `md` / `lg` / `xl`.
   * @default "md"
   */
  size?: UserAvatarSize;
  /** Accent for the fallback chip. @default "neutral" */
  tone?: TrueColor;
  /** @default "circle" */
  shape?: UserAvatarShape;
  /** @deprecated Use `shape`. */
  variant?: UserAvatarShape;
  /**
   * Text content, the PrimeVue `label` parity prop. Wins over `icon` and the
   * image, exactly as it does there, and gives the avatar its accessible name
   * when there is no user behind it.
   */
  label?: string;
  /** Registry icon name or element, the PrimeVue `icon` parity prop. */
  icon?: IconName | ReactElement;
  /**
   * Direct image URL, the PrimeVue `image` parity prop. `user.avatarUrl`
   * still resolves when this is absent; either way a broken URL falls back
   * to the label, initial or glyph instead of breaking the layout.
   */
  image?: string;
  /**
   * Replaces the rendered content wholesale — the PrimeVue `template` slot.
   * The wrapper keeps its box, shape and accessible name.
   */
  children?: ReactNode;
  className?: string;
}

const SIZE_PX: Record<ControlSize, number> = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40,
  xl: 48,
};

const SIZE_TEXT: Record<ControlSize, string> = {
  xs: "text-[10px]",
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

const SHAPE_CLASS: Record<UserAvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-md",
  square: "rounded-none",
};

/** PrimeVue's size names, folded onto the shared ladder. */
const PRESET_TO_CONTROL: Record<UserAvatarPresetSize, ControlSize> = {
  normal: "md",
  large: "lg",
  xlarge: "xl",
};

/** The nearest control size for an explicit pixel box, for the type scale. */
const sizeKeyFor = (px: number): ControlSize =>
  (Object.keys(SIZE_PX) as ControlSize[]).reduce((best, key) =>
    Math.abs(SIZE_PX[key] - px) < Math.abs(SIZE_PX[best] - px) ? key : best,
  );

/** Pixel box for any accepted size spelling. */
const sizePx = (size: UserAvatarSize): number => {
  if (typeof size === "number") return size;
  if (size in PRESET_TO_CONTROL) {
    return SIZE_PX[PRESET_TO_CONTROL[size as UserAvatarPresetSize]];
  }
  return SIZE_PX[size as ControlSize];
};

/** Ladder rung for any accepted size spelling, for the type and icon scale. */
const sizeKey = (size: UserAvatarSize): ControlSize => {
  if (typeof size === "number") return sizeKeyFor(size);
  if (size in PRESET_TO_CONTROL) {
    return PRESET_TO_CONTROL[size as UserAvatarPresetSize];
  }
  return size as ControlSize;
};

export const UserAvatar = ({
  user,
  size = "md",
  tone = "neutral",
  shape,
  variant,
  label,
  icon,
  image,
  children,
  className = "",
  ...rest
}: UserAvatarProps) => {
  const renderIcon = useIconRenderer();
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  // A direct `image` wins over `user.avatarUrl`, mirroring how PrimeVue's
  // `image` prop is the one source there while our `user` object stays.
  const src = image ?? user?.avatarUrl ?? null;

  useEffect(() => {
    setHasError(false);
    setImgSrc(src);
  }, [src]);

  const px = sizePx(size);
  const key = sizeKey(size);
  const resolvedShape = shape ?? variant ?? "circle";
  const shapeClass = SHAPE_CLASS[resolvedShape];
  // Was a hardcoded `bg-slate-200 text-slate-600` with a `dark:` partner only
  // on the fallback — so the chip was slate whatever the app's palette, and
  // there was no way to tone it.
  const chip = getPillColorClasses(tone, "soft");

  const identifier = user?.name || user?.username || user?.email;

  // Shared skin for everything that draws on the tone chip: label, icon and
  // the initial/glyph fallback.
  const chipInner = (node: ReactNode) => (
    <div
      className={classNames(
        "flex h-full w-full items-center justify-center overflow-hidden font-bold",
        SIZE_TEXT[key],
        chip.base,
        shapeClass,
      )}
    >
      {node}
    </div>
  );

  let content: ReactNode;
  if (children != null) {
    // The PrimeVue `template` slot: full control of the inside.
    content = children;
  } else if (label) {
    // PrimeVue's own precedence: label over icon over image.
    content = chipInner(
      <span className="max-w-full truncate leading-none">{label}</span>,
    );
  } else if (icon) {
    content = chipInner(renderIcon(icon, key));
  } else if (!hasError && imgSrc) {
    content = (
      <img
        src={imgSrc}
        // Decorative: the wrapper carries the accessible name, so the img
        // must not announce the label twice.
        alt=""
        className={classNames("h-full w-full object-cover", shapeClass)}
        // A DOM `onError` in `rest` lands on the wrapper and React bubbles
        // the img error to it — the PrimeVue `@error` parity.
        onError={() => setHasError(true)}
      />
    );
  } else if (identifier) {
    content = chipInner(identifier[0].toUpperCase());
  } else {
    content = chipInner(
      // Decorative: the wrapper already carries the accessible name.
      <span aria-hidden="true">{renderIcon("User", "xs")}</span>,
    );
  }

  return (
    <div
      {...rest}
      // The avatar stands for a person, so it needs a name of its own; it used
      // to be an unlabelled `<div>` with an `<img alt>` only in the happy path.
      role="img"
      aria-label={rest["aria-label"] ?? identifier ?? label ?? "User avatar"}
      title={rest.title ?? identifier}
      className={classNames(
        "flex items-center justify-center overflow-hidden",
        shapeClass,
        className,
      )}
      style={{ width: px, height: px, ...rest.style }}
    >
      {content}
    </div>
  );
};

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
