import React from "react";
import type { Components } from "react-markdown";
import CodeBlock, { type CodeBlockProps } from "./components/CodeBlock";

/** Override React Markdown's pre renderer; inline code keeps its native renderer. */
export function createCodeBlockMarkdownComponents(
  options: Omit<CodeBlockProps, "value" | "onChange" | "readOnly"> = {},
): Components {
  return {
    pre: ({ children, node: _node, ref: _ref, ...props }) => {
      const child = React.Children.toArray(children)[0];
      if (!React.isValidElement<{ children?: React.ReactNode; className?: string }>(child) || typeof child.props.children !== "string") {
        return <pre {...props}>{children}</pre>;
      }
      const language = /(?:^|\s)language-([^\s]+)/.exec(child.props.className ?? "")?.[1];
      // Markdown's parser owns fence normalization; preserve the code node verbatim.
      return <CodeBlock {...options} value={child.props.children} language={language || options.language} readOnly />;
    },
  };
}
