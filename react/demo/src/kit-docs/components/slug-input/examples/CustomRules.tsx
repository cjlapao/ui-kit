import { FormField, SlugInput } from "@cjlapao/ui-kit";

export default function CustomRules() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField label="Dash case">
        <SlugInput
          defaultValue="Hello, World! Foo_Bar 2024"
          slugifyOptions={{ separator: "-" }}
        />
      </FormField>
      <FormField label="SCREAMING_SNAKE">
        <SlugInput
          defaultValue="Hello, World!"
          slugifyOptions={{ case: "upper" }}
        />
      </FormField>
      <FormField label="Dots allowed, case preserved">
        <SlugInput
          defaultValue="Release v1.2.3 Final"
          slugifyOptions={{ allowed: ".", case: "preserve" }}
        />
      </FormField>
      <FormField label="Full override — first 12 chars, dashed">
        <SlugInput
          defaultValue="Truncated under the override"
          slugify={(value) => value.toLowerCase().slice(0, 12).trim().replace(/\s+/g, "-")}
        />
      </FormField>
    </div>
  );
}
