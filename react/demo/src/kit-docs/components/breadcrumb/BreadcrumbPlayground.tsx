import React, { useState } from "react";
import { Breadcrumb, MultiToggle } from "@cjlapao/ui-kit";
import type {
  BreadcrumbItem,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { trueColorOptions } from "../../shared/options";

const separatorOptions = [
  { label: "Chevron", value: "chevron" },
  { label: "Slash", value: "slash" },
  { label: "Dot", value: "dot" },
];

const FULL_ITEMS: BreadcrumbItem[] = [
  { label: "Products", to: "/products" },
  { icon: "Cog", label: "Electronics", to: "/products/electronics" },
  { label: "Laptops", to: "/products/electronics/laptops" },
  { label: "Dell", current: true },
];

export const BreadcrumbPlayground: React.FC = () => {
  const [color, setColor] = useState<TrueColor>("blue");
  const [separator, setSeparator] = useState("chevron");
  const [showHome, setShowHome] = useState(true);
  const [ellipsis, setEllipsis] = useState(false);

  const items: BreadcrumbItem[] = ellipsis
    ? [
        { icon: "Dots", to: "/products", ariaLabel: "Skipped items" },
        ...FULL_ITEMS.slice(1),
      ]
    : FULL_ITEMS;

  return (
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Color"
            options={trueColorOptions}
            value={color}
            onChange={(v) => setColor(v as TrueColor)}
          />
          <Control label="Separator">
            <MultiToggle
              fullWidth
              size="sm"
              options={separatorOptions}
              value={separator}
              onChange={setSeparator}
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Home crumb" checked={showHome} onChange={setShowHome} />
            <ToggleRow label="Ellipsis" checked={ellipsis} onChange={setEllipsis} />
          </div>
        </>
      }
      preview={
        <div className="flex w-full flex-col items-center gap-3">
          <Breadcrumb
            color={color}
            separator={
              separator === "slash" ? "/" : separator === "dot" ? "·" : undefined
            }
            home={
              showHome
                ? { icon: "Dashboard", to: "/", ariaLabel: "Home" }
                : undefined
            }
            items={items}
          />
        </div>
      }
    />
  );
};
