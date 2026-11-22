import { forwardRef, type SVGProps } from "react";

export const Disable = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      ref={ref}
    >
      <path
        d="m16 0c8.836556 0 16 7.163444 16 16s-7.163444 16-16 16-16-7.163444-16-16 7.163444-16 16-16zm0 2c-7.7319865 0-14 6.2680135-14 14s6.2680135 14 14 14 14-6.2680135 14-14-6.2680135-14-14-14zm3.5355339 9.0502525 1.4142136 1.4142136-8.4852814 8.4852814-1.4142136-1.4142136z"
        fill="currentColor"
      />
    </svg>
  ),
);

Disable.displayName = "Disable";
