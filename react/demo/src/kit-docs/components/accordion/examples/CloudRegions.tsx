import { useState } from "react";
import { Accordion, Button, useAccordion } from "@cjlapao/ui-kit";

const REGIONS = [
  {
    id: "region-us",
    title: "United States",
    subtitle: "us-east-1 · N. Virginia",
    description: "Low latency for east coast workloads.",
    badge: "Primary",
    content: (
      <div className="space-y-2">
        <p>
          Availability zones: <strong>3</strong>
        </p>
        <p>Average latency: 22 ms</p>
        <ul className="list-disc pl-5">
          <li>GPU instances available</li>
          <li>Supports spot capacity</li>
        </ul>
      </div>
    ),
  },
  {
    id: "region-eu",
    title: "Europe",
    subtitle: "eu-central-1 · Frankfurt",
    description: "Ideal for GDPR-compliant workloads.",
    badge: "High demand",
    content: (
      <div className="space-y-2">
        <p>Availability zones: 2</p>
        <p>Average latency: 39 ms</p>
        <p>Maintenance window: Sundays 02:00–04:00 CET</p>
      </div>
    ),
  },
  {
    id: "region-apac",
    title: "Asia Pacific",
    subtitle: "ap-southeast-1 · Singapore",
    description: "Great for APAC users and low-latency APIs.",
    content: (
      <div className="space-y-2">
        <p>Availability zones: 3</p>
        <p>Average latency: 55 ms</p>
        <p>Dedicated bare-metal hosts available on request.</p>
      </div>
    ),
  },
];

export default function CloudRegions() {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const accordion = useAccordion({
    defaultOpenIds: ["region-us"],
    multiple: true,
  });

  const refresh = (id: string) => {
    setLoadingIds((ids) => [...ids, id]);
    setTimeout(() => {
      setLoadingIds((ids) => ids.filter((item) => item !== id));
    }, 1500);
  };

  return (
    <Accordion
      tone="blue"
      size="sm"
      items={REGIONS.map((region) => ({
        ...region,
        icon: "Globe",
        content: region.content,
        actions: region.id === "region-us" ? (
          <Button
            size="xs"
            variant="ghost"
            color="blue"
            onClick={() => refresh(region.id)}
          >
            Refresh
          </Button>
        ) : undefined,
        loading: loadingIds.includes(region.id),
      }))}
      openIds={accordion.openIds}
      onChange={accordion.setOpenIds}
      ariaLabel="Cloud regions"
    />
  );
}
