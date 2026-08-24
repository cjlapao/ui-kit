import React from "react";

interface PageHeaderProps {
  name: string;
  description: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ name, description }) => (
  <header className="flex flex-col gap-1.5">
    <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
      {name}
    </h1>
    <p className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
      {description}
    </p>
  </header>
);
