import { useState } from "react";
import { ApiErrorState } from "@cjlapao/ui-kit";

/**
 * `retrying` puts the button in its loading state and blocks it, so a slow
 * request cannot be fired twice by an impatient second press.
 */
export default function Retry() {
  const [retrying, setRetrying] = useState(false);

  return (
    <ApiErrorState
      kind="server"
      retrying={retrying}
      buttonText="Try again"
      onRetry={() => {
        setRetrying(true);
        setTimeout(() => setRetrying(false), 2000);
      }}
    />
  );
}
