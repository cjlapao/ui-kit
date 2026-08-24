import { IconButton, Tooltip } from "@cjlapao/ui-kit";

export default function IconButtons() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip text="Refresh the list">
        <IconButton icon="Refresh" variant="soft" color="blue" srLabel="Refresh" />
      </Tooltip>
      <Tooltip text="Download as CSV">
        <IconButton icon="Download" variant="soft" color="blue" srLabel="Download" />
      </Tooltip>
      <Tooltip text="Remove the item">
        <IconButton icon="Trash" variant="soft" color="rose" srLabel="Remove" />
      </Tooltip>
    </div>
  );
}
