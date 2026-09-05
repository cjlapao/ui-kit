import { Button, IconButton, Toolbar, UserAvatar } from "@cjlapao/ui-kit";

/**
 * PrimeVue's "custom" demo shape — a navigation bar. A toolbar is just a
 * named row of controls, so it carries a navbar as well as a document bar;
 * the `end` group ends with a `UserAvatar` so the signed-in person is part
 * of the bar's accessible furniture.
 */
export default function Nav() {
  return (
    <div className="w-full">
      <Toolbar
        aria-label="Navigation"
        start={
          <>
            <span className="select-none px-1 text-sm font-semibold tracking-tight">
              ui-kit
            </span>
            <Button variant="ghost" size="sm">
              File
            </Button>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              View
            </Button>
          </>
        }
        end={
          <>
            <IconButton icon="Settings" variant="ghost" srLabel="Settings" />
            <Button size="sm" leadingIcon="Send">
              Share
            </Button>
            <UserAvatar user={{ name: "Ada Lovelace" }} />
          </>
        }
      />
    </div>
  );
}
