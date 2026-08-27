import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { VariablePickerPlayground } from "./VariablePickerPlayground";

export const VariablePickerPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Variable Picker"
      description="The panel SmartInput and MarkdownEditor open to insert a token: one tab per group, a live search, and each row showing its token badge and resolved value. It renders a Panel and reads its copy colours from the surface, so it sits correctly on glass."
    />
    <VariablePickerPlayground />
  </div>
);

export default VariablePickerPage;
