import type { WorkflowData } from "./types";

/**
 * Default fixture — a vendor-onboarding pipeline. The component is
 * domain-agnostic; this exists so `<WorkflowTracker />` renders with no props.
 */
export const sampleWorkflow: WorkflowData = {
  eyebrow: "VENDOR ONBOARDING · REQ-4128",
  title: "Northwind Logistics GmbH",
  live: true,
  activeStepId: "security_questionnaire",
  steps: [
    {
      id: "request_submitted",
      label: "Request submitted",
      status: "done",
      meta: "2m",
    },
    {
      id: "duplicate_check",
      label: "Duplicate check",
      status: "skipped",
      badge: "Not needed",
      meta: "No match in registry",
    },
    {
      id: "business_verification",
      label: "Business verification",
      status: "done",
      meta: "12m · 3 of 3 sub-steps",
    },
    {
      id: "sanctions_screening",
      label: "Sanctions screening",
      status: "done",
      meta: "4m",
    },
    {
      id: "tax_documents",
      label: "Tax documents",
      status: "skipped",
      badge: "Skipped",
      meta: "Skipped by M. Reyes · resume anytime",
    },
    {
      id: "insurance_certificates",
      label: "Insurance certificates",
      status: "attention",
      badge: "Needs attention",
      meta: "1h 06m · Liability certificate expired 12 Aug",
    },
    {
      id: "contract_drafting",
      label: "Contract drafting",
      status: "done",
      meta: "1h 10m",
    },
    {
      id: "security_questionnaire",
      label: "Security questionnaire",
      status: "in_progress",
      badge: "In progress",
      meta: "24m · 3 of 6 sub-steps",
      elapsed: "24m",
      description:
        "Vendor is completing the long-form questionnaire. Each sub-step unlocks once its evidence file is accepted by the reviewer.",
      owner: "D. Okafor",
      startedAt: "19 Aug · 09:12",
      sla: "Due in 6h",
      subSteps: [
        {
          id: "data_handling",
          label: "Data handling policy",
          status: "done",
          badge: "Accepted",
          duration: "5m",
        },
        {
          id: "pentest",
          label: "Penetration test report",
          status: "done",
          badge: "Accepted",
          duration: "8m",
        },
        {
          id: "soc2",
          label: "SOC 2 Type II evidence",
          status: "done",
          badge: "Accepted",
          duration: "11m",
        },
        {
          id: "subprocessor_list",
          label: "Subprocessor list",
          status: "running",
          badge: "Running",
          note: "Vendor uploading — 2 of 3 files received",
        },
        {
          id: "incident_response",
          label: "Incident response plan",
          status: "skipped",
          badge: "Skipped",
          note: "Covered by master agreement §7",
        },
        {
          id: "business_continuity",
          label: "Business continuity plan",
          status: "not_started",
        },
      ],
    },
    {
      id: "legal_review",
      label: "Legal review",
      status: "blocked",
      badge: "Blocked",
      meta: "Waiting on Legal · queued 2d",
    },
    {
      id: "banking_details",
      label: "Banking details",
      status: "not_started",
    },
    {
      id: "system_provisioning",
      label: "System provisioning",
      status: "not_started",
    },
    { id: "go_live", label: "Go-live", status: "not_started" },
  ],
};

export default sampleWorkflow;
