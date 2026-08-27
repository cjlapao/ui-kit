import { Accordion } from "@cjlapao/ui-kit";

const QUESTIONS = [
  {
    id: "q-1",
    title: "How do billing cycles work?",
    content:
      "Invoices are issued on the 1st of each month. Prorations apply automatically when you change plans mid-cycle.",
  },
  {
    id: "q-2",
    title: "Can I change regions later?",
    content:
      "Yes. Workloads can be migrated between regions from the console. Data is replicated during the migration window.",
  },
  {
    id: "q-3",
    title: "What happens when a region is down?",
    content:
      "Requests are rerouted to the nearest healthy region automatically. A status incident is opened and tracked here.",
  },
  {
    id: "q-4",
    title: "Do you offer a free tier?",
    content:
      "New workspaces get 30 days of the Pro plan. After that you can stay on the free tier or upgrade.",
  },
];

export default function Faq() {
  return (
    <Accordion
      variant="outlined"
      size="md"
      defaultOpenIds={["q-1"]}
      items={QUESTIONS}
      ariaLabel="Frequently asked questions"
    />
  );
}
