import { API_ERROR_KINDS, ApiErrorState } from "@cjlapao/ui-kit";

/**
 * `kind` is what actually went wrong, and it picks the tone, the glyph and the
 * copy from one table — the same reasoning as `Alert`'s `intent`. Every caller
 * translating a status code into a colour *and* an icon *and* two strings is
 * how one screen ends up saying "Connection Error" for a 403.
 *
 * It also decides whether a retry is offered at all: a refusal does not clear
 * by pressing a button, so `forbidden` and `notFound` get no retry here.
 */
export default function Kinds() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {API_ERROR_KINDS.map((kind) => (
        <ApiErrorState
          key={kind}
          kind={kind}
          size="sm"
          onRetry={
            kind === "forbidden" || kind === "notFound"
              ? undefined
              : () => {}
          }
        />
      ))}
    </div>
  );
}
