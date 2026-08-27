import { useState, forwardRef, type ForwardedRef } from "react";
import Input, { type InputProps } from "./Input";

export interface PasswordInputProps
  extends Omit<InputProps, "type" | "trailingIcon" | "onTrailingIconClick"> {
  /**
   * Offer the reveal toggle at all. Turn it off for a field the user should
   * never be able to read back (a stored secret being re-entered).
   * @default true
   */
  revealable?: boolean;
  /** Controlled reveal state. Omit for uncontrolled. */
  revealed?: boolean;
  /** Fires whenever the reveal state changes. */
  onRevealedChange?: (revealed: boolean) => void;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { revealable = true, revealed, onRevealedChange, ...props },
    ref: ForwardedRef<HTMLInputElement>,
  ) {
    const [internal, setInternal] = useState(false);
    const isControlled = revealed !== undefined;
    const show = isControlled ? revealed : internal;

    const toggle = () => {
      const next = !show;
      if (!isControlled) setInternal(next);
      onRevealedChange?.(next);
    };

    // The toggle is pointless on a field the user cannot edit, and it used to
    // stay live there — a disabled password field could still be read.
    const canReveal = revealable && !props.disabled && !props.readOnly;

    return (
      <Input
        {...props}
        ref={ref}
        type={show && canReveal ? "text" : "password"}
        // Registry names, not raw icon components with a hardcoded `w-4 h-4`.
        // The literal size meant the glyph stayed 16px at every `size`, so it
        // was visibly too small on `lg` and `xl`, and it bypassed the kit's
        // icon renderer entirely.
        trailingIcon={canReveal ? (show ? "EyeClosed" : "EyeOpen") : undefined}
        onTrailingIconClick={canReveal ? toggle : undefined}
        trailingIconLabel={show ? "Hide password" : "Show password"}
      />
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
