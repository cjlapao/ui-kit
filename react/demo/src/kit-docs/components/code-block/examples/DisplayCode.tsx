import { CodeBlock } from "@cjlapao/ui-kit";

export function DisplayCode() {
  return <CodeBlock filename="greeting.ts" language="typescript" showLineNumbers value={'type Greeting = { name: string };\n\nexport function greet({ name }: Greeting) {\n  return `Hello, ${name}`;\n}\n'} />;
}

