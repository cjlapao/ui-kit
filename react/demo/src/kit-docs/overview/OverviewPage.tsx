import React from "react";
import { Link } from "react-router-dom";
import { CustomIcon, Panel } from "@cjlapao/ui-kit";
import { DOC_CATEGORIES, DOC_COMPONENTS } from "../registry";
import { CodeBlock } from "../shared/CodeBlock";

const INSTALL_CODE = "npm install @cjlapao/ui-kit";

const IMPORT_CODE = `import { Button, useTheme } from "@cjlapao/ui-kit";
import "@cjlapao/ui-kit/styles.css";`;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
    {children}
  </h2>
);

export const OverviewPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <header className="flex flex-col gap-1.5">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        ui-kit for React
      </h1>
      <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        A living documentation site for the React kit. Every page starts with an
        interactive playground you can poke at, then shows the component in
        realistic scenarios — each with the exact code that generates it, ready
        to copy.
      </p>
    </header>

    <section className="flex flex-col">
      <SectionTitle>Get started</SectionTitle>
      <Panel variant="outlined" padding="none" scrollable={false}>
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            Install
          </h3>
          <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            The kit ships React 18/19 support. React Router is a peer dependency
            used by layout components.
          </p>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800">
          <CodeBlock code={INSTALL_CODE} language="bash" filename="terminal" />
        </div>
        <div className="px-5 py-4">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            Import
          </h3>
          <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            Everything is available from the package root, including the theme
            hook and the kit stylesheet.
          </p>
        </div>
        <CodeBlock code={IMPORT_CODE} filename="main.tsx" />
      </Panel>
    </section>

    {DOC_CATEGORIES.map((category) => {
      const components = DOC_COMPONENTS.filter(
        (component) => component.category === category,
      );
      if (components.length === 0) return null;
      return (
        <section key={category} className="flex flex-col">
          <SectionTitle>{category}</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {components.map((component) => (
              <Link key={component.slug} to={`/docs/${component.slug}`}>
                <Panel
                  variant="outlined"
                  padding="md"
                  className="h-full transition-shadow duration-150 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <CustomIcon icon={component.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                        {component.name}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-neutral-500 dark:text-neutral-400">
                        {component.description}
                      </span>
                    </span>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        </section>
      );
    })}
  </div>
);
