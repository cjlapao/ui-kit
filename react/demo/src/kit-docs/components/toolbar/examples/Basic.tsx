import { Button, IconButton, Input, Toolbar } from "@cjlapao/ui-kit";

/**
 * PrimeVue Toolbar's own demo: actions on the left, a search field in the
 * middle, the primary action on the right. The three regions are the props
 * `start`, `center` and `end` — Vue's named slots of the same names.
 */
export default function Basic() {
  return (
    <div className="w-full">
      <Toolbar
        aria-label="Document actions"
        start={
          <>
            <IconButton icon="Add" variant="ghost" srLabel="Add" />
            <IconButton icon="Send" variant="ghost" srLabel="Send" />
            <IconButton icon="Download" variant="ghost" srLabel="Download" />
          </>
        }
        center={<Input leadingIcon="Search" placeholder="Search" className="w-56" />}
        end={
          <Button leadingIcon="Save" color="indigo">
            Save
          </Button>
        }
      />
    </div>
  );
}
