import React from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { UxDemo } from "./pages/UxDemo/UxDemo";
import { DocsApp } from "./kit-docs/DocsApp";

const DemoRouteSink: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-6 text-center dark:bg-slate-950">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Demo navigation target —{" "}
        <code className="font-mono text-blue-600 dark:text-blue-400">
          {pathname}
        </code>
      </p>
      <p className="max-w-md text-sm text-slate-400 dark:text-slate-500">
        This is not a real page. The demo menus link here to show navigation
        and active-state behavior without a backend.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to the demo
      </Link>
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white dark:bg-slate-950">
              <UxDemo />
            </div>
          }
        />
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="*" element={<DemoRouteSink />} />
      </Routes>
    </BrowserRouter>
  );
};
