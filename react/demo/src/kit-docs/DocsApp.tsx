import React, { Suspense, useEffect, useMemo } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  Breadcrumb,
  CustomIcon,
  SideMenuLayout,
  Spinner,
  useTheme,
  type BreadcrumbItem,
  type SideMenuItem,
} from "@cjlapao/ui-kit";
import { DOC_CATEGORIES, DOC_COMPONENTS, findDocComponent } from "./registry";
import { OverviewPage } from "./overview/OverviewPage";
import { ThemeToggle } from "./shared/ThemeToggle";

const SCROLL_CONTAINER_ID = "docs-scroll";

const scrollToTop = () => {
  document.getElementById(SCROLL_CONTAINER_ID)?.scrollTo({ top: 0 });
};

const ComponentRoute: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = findDocComponent(slug);

  useEffect(() => {
    scrollToTop();
  }, [slug]);

  if (!entry) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-3 px-4 py-16 sm:px-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Page not found
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          There is no docs page at <code className="font-mono">/docs/{slug}</code>.
        </p>
        <Link
          to="/docs/overview"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          Back to the overview
        </Link>
      </div>
    );
  }

  const Page = entry.Page;

  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-16">
          <Spinner size="md" color="blue" />
        </div>
      }
    >
      <Page />
    </Suspense>
  );
};

/**
 * The header's trail, derived from the route: the brand acts as home, so the
 * breadcrumb starts at the docs section.
 */
const DocsBreadcrumb: React.FC = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/")[2];
  const entry = findDocComponent(slug);

  const items: BreadcrumbItem[] = entry
    ? [
        { label: "React docs", to: "/docs/overview" },
        { label: entry.name, current: true },
      ]
    : [{ label: "React docs", to: "/docs/overview", current: true }];

  return <Breadcrumb items={items} ariaLabel="Docs breadcrumb" />;
};

const buildMenuItems = (): SideMenuItem[] => {
  const items: SideMenuItem[] = [
    {
      slug: "overview",
      type: "link",
      label: "Overview",
      path: "/docs/overview",
      icon: "Dashboard",
    },
  ];
  for (const category of DOC_CATEGORIES) {
    const groupSlug = category.toLowerCase();
    const categoryComponents = DOC_COMPONENTS.filter(
      (component) => component.category === category,
    );
    if (categoryComponents.length === 0) continue;
    items.push({ slug: groupSlug, type: "group", label: category });
    for (const component of categoryComponents) {
      items.push({
        slug: component.slug,
        type: "link",
        label: component.name,
        path: `/docs/${component.slug}`,
        icon: component.icon,
        groupName: groupSlug,
      });
    }
  }
  return items;
};

export const DocsApp: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const menuItems = useMemo(buildMenuItems, []);

  return (
    <div className="h-dvh bg-white dark:bg-slate-950">
      <SideMenuLayout
        sideMenuProps={{
          title: "Components",
          color: "blue",
          logoIcon: <CustomIcon icon="UX" className="h-6 w-6 text-blue-500" />,
          logoText: (
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              ui-kit
            </span>
          ),
          items: menuItems,
          search: true,
          searchPlaceholder: "Search components",
        }}
        header={
          <header className="flex h-14 items-center justify-between gap-4 border-b border-neutral-200/70 bg-white px-5 dark:border-neutral-800 dark:bg-slate-950">
            <div className="flex min-w-0 items-center gap-3 text-sm">
              <Link
                to="/"
                className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <CustomIcon icon="UX" className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                  ui-kit
                </span>
              </Link>
              <DocsBreadcrumb />
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Legacy demo
              </a>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </header>
        }
        bodyClassName={`${SCROLL_CONTAINER_ID} bg-white dark:bg-slate-950`}
      >
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          {/* The charts section replaced the old single chart page. */}
          <Route path="chart" element={<Navigate to="/docs/charts" replace />} />
          <Route path=":slug" element={<ComponentRoute />} />
          <Route path="*" element={<ComponentRoute />} />
        </Routes>
      </SideMenuLayout>
    </div>
  );
};
