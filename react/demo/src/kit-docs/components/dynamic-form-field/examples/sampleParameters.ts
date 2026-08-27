import { CapsuleBlueprintValueType } from "@cjlapao/ui-kit";
import type { CapsuleBlueprintParameter } from "@cjlapao/ui-kit";

/** One parameter of each value type a blueprint can declare. */
export const PARAMETERS: CapsuleBlueprintParameter[] = [
  {
    name: "Service name",
    key: "service_name",
    value_type: CapsuleBlueprintValueType.String,
    is_required: true,
    hint: "Lowercase, no spaces.",
    help: "The name the service registers under. It is used in DNS, so it has to be unique within the environment and cannot be changed after the first deploy.",
  },
  {
    name: "Replicas",
    key: "replicas",
    value_type: CapsuleBlueprintValueType.Int,
    hint: "How many instances to run.",
  },
  {
    name: "API token",
    key: "api_token",
    value_type: CapsuleBlueprintValueType.String,
    is_secret: true,
    hint: "Stored encrypted; never shown again.",
  },
  {
    name: "Enable TLS",
    key: "tls",
    value_type: CapsuleBlueprintValueType.Boolean,
    hint: "Terminate HTTPS at the ingress.",
  },
  {
    name: "Region",
    key: "region",
    value_type: CapsuleBlueprintValueType.Select,
    options: [
      { key: "eu-west-1", label: "Ireland" },
      { key: "us-east-1", label: "N. Virginia" },
      { key: "ap-northeast-1", label: "Tokyo" },
    ],
    hint: "Where the workload runs.",
  },
  {
    name: "Allowed origins",
    key: "origins",
    value_type: CapsuleBlueprintValueType.List,
    hint: "One origin per line.",
  },
  {
    name: "Environment",
    key: "env",
    value_type: CapsuleBlueprintValueType.Map,
    hint: "Injected into the container.",
  },
];
