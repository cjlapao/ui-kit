import { CodeBlock } from "@cjlapao/ui-kit";

export function ThemeCode() {
  return <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2"><CodeBlock color="emerald" variant="outlined" language="bash" value={'npm run build\necho "Ready"'} /><CodeBlock color="violet" variant="glass" language="css" value={'.card {\n  border-radius: 12px;\n}'} /></div>;
}

