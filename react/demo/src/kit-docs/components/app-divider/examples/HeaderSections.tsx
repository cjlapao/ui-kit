import { AppDivider } from "@cjlapao/ui-kit";

export default function HeaderSections() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex h-16 items-center justify-between">
        <span className="font-medium">Home</span>
        <AppDivider orientation="vertical" size="sm" />
        <span className="font-medium">Reports</span>
        <AppDivider orientation="vertical" size="sm" />
        <span className="font-medium">Settings</span>
      </div>
      <div className="flex flex-col gap-3">
        <p>Sign in with your work account.</p>
        <AppDivider orientation="horizontal" label="OR" />
        <p>Continue with a single-use link instead.</p>
      </div>
    </div>
  );
}
