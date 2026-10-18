import React, { useState } from "react";
import {
  Breadcrumb,
  ColorSwatches,
  type BreadcrumbItem,
  type ControlSize,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { controlSizeOptions } from "../../shared/options";

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
  const [size, setSize] = useState<ControlSize>("md");
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
        <ControlAccordion
          groups={[
            {
              id: "options",
              title: "Options",
              controls: (
                <>
                  {/* Tone is a colour decision — pick it from colour swatches,
                      not from a dropdown of words. */}
                  <Control label="Tone">
                    <ColorSwatches
                      selectable
                      size="sm"
                      value={color}
                      onSelect={setColor}
                      defaultExpanded
                    />
                  </Control>
                  <ChoiceControl
                    label="Size"
                    options={controlSizeOptions}
                    value={size}
                    onChange={(v) => setSize(v as ControlSize)}
                  />
                  <ChoiceControl
                    label="Separator"
                    options={separatorOptions}
                    value={separator}
                    onChange={setSeparator}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <ToggleRow label="Home crumb" checked={showHome} onChange={setShowHome} />
                    <ToggleRow label="Ellipsis" checked={ellipsis} onChange={setEllipsis} />
                  </div>
                </>
              ),
            },
          ]}
        />
      }
      preview={
        <div className="flex w-full flex-col items-center gap-3">
          <Breadcrumb
            color={color}
            size={size}
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
