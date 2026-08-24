import { useState } from "react";
import { Checkbox } from "@cjlapao/ui-kit";

const CHILDREN = ["Containers", "Images", "Volumes"];

export default function SelectAll() {
  const [items, setItems] = useState([true, false, false]);
  const checkedCount = items.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        color="blue"
        label="All resources"
        description={`${checkedCount} of ${CHILDREN.length} selected`}
        checked={checkedCount === CHILDREN.length}
        indeterminate={checkedCount > 0 && checkedCount < CHILDREN.length}
        onChange={(event) =>
          setItems(items.map(() => event.target.checked))
        }
      />
      <div className="ml-6 flex flex-col gap-2">
        {CHILDREN.map((label, index) => (
          <Checkbox
            key={label}
            color="blue"
            label={label}
            checked={items[index]}
            onChange={(event) =>
              setItems(
                items.map((value, i) =>
                  i === index ? event.target.checked : value,
                ),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
