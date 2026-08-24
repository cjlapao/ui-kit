import { Tree } from "@cjlapao/ui-kit";

export default function Empty() {
  return (
    <div className="w-full max-w-md">
      <Tree
        items={[]}
        emptyMessage="No folders yet — create your first folder to start building a tree."
        ariaLabel="Files"
      />
    </div>
  );
}
