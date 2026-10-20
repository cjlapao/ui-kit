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
      details: (
        <div className="space-y-3 px-5 py-4 sm:px-6">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The liability certificate expired on 12 Aug. A reminder went to
            the vendor&rsquo;s compliance contact; the underwriter quote is
            still pending.
          </p>
          <ul className="flex flex-wrap gap-2">
            {["reminder-12-aug.pdf", "underwriter-quote.pdf"].map((file) => (
              <li
                key={file}
                className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
              >
                {file}
              </li>
            ))}
          </ul>
        </div>
      ),
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
      details: (
        <div className="space-y-5 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Review activity
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Reviewer A. Lindqvist is cross-checking the subprocessor list
              against the master agreement. Uploads appear here as the vendor
              submits them.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Files received
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {[
                "data-handling-v3.pdf",
                "pentest-2026.pdf",
                "soc2-typeii.pdf",
              ].map((file) => (
                <li
                  key={file}
                  className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
                >
                  {file}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Open findings
            </p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                <span
                  aria-hidden="true"
                  className="mt-[9px] size-1.5 shrink-0 rounded-full bg-amber-400"
                />
                Subprocessor &ldquo;CloudDot BV&rdquo; is not covered by the
                DPA yet
              </li>
              <li className="flex items-start gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                <span
                  aria-hidden="true"
                  className="mt-[9px] size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600"
                />
                Waiting on the incident-contact annex
              </li>
            </ul>
          </div>
        </div>
      ),
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
