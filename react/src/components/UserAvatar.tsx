import { useState, useEffect } from "react";
import classNames from "classnames";
import { useIconRenderer } from "../contexts/IconContext";
import {
  getPillColorClasses,
  type ControlSize,
  type TrueColor,
} from "../theme/Theme";

export const USER_AVATAR_SHAPES = ["circle", "rounded", "square"] as const;
export type UserAvatarShape = (typeof USER_AVATAR_SHAPES)[number];

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
   * works and wins, for the call sites that need an exact box.
   * @default "md"
   */
  size?: ControlSize | number;
  /** Accent for the fallback chip. @default "neutral" */
  tone?: TrueColor;
  /** @default "circle" */
  shape?: UserAvatarShape;
  /** @deprecated Use `shape`. */
  variant?: UserAvatarShape;
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

/** The nearest control size for an explicit pixel box, for the type scale. */
const sizeKeyFor = (px: number): ControlSize =>
  (Object.keys(SIZE_PX) as ControlSize[]).reduce((best, key) =>
    Math.abs(SIZE_PX[key] - px) < Math.abs(SIZE_PX[best] - px) ? key : best,
  );

export const UserAvatar = ({
  user,
  size = "md",
  tone = "neutral",
  shape,
  variant,
  className = "",
  ...rest
}: UserAvatarProps) => {
  const renderIcon = useIconRenderer();
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    setHasError(false);
    setImgSrc(user?.avatarUrl ?? null);
  }, [user?.avatarUrl]);

  const px = typeof size === "number" ? size : SIZE_PX[size];
  const sizeKey = typeof size === "number" ? sizeKeyFor(size) : size;
  const resolvedShape = shape ?? variant ?? "circle";
  const shapeClass = SHAPE_CLASS[resolvedShape];
  // Was a hardcoded `bg-slate-200 text-slate-600` with a `dark:` partner only
  // on the fallback — so the chip was slate whatever the app's palette, and
  // there was no way to tone it.
  const chip = getPillColorClasses(tone, "soft");

  const identifier = user?.name || user?.username || user?.email;
  const label = identifier ?? "User avatar";

  const fallback = (
    <div
      className={classNames(
        "flex h-full w-full items-center justify-center font-bold",
        SIZE_TEXT[sizeKey],
        chip.base,
        shapeClass,
      )}
    >
      {identifier ? (
        identifier[0].toUpperCase()
      ) : (
        // Decorative: the wrapper already carries the accessible name.
        <span aria-hidden="true">{renderIcon("User", "xs")}</span>
      )}
    </div>
  );

  return (
    <div
      {...rest}
      // The avatar stands for a person, so it needs a name of its own; it used
      // to be an unlabelled `<div>` with an `<img alt>` only in the happy path.
      role="img"
      aria-label={label}
      title={identifier}
      className={classNames(
        "flex items-center justify-center overflow-hidden",
        shapeClass,
        className,
      )}
      style={{ width: px, height: px, ...rest.style }}
    >
      {!hasError && imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          className={classNames("h-full w-full object-cover", shapeClass)}
          onError={() => setHasError(true)}
        />
      ) : (
        fallback
      )}
    </div>
  );
};

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
