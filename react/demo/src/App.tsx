import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DocsApp } from "./kit-docs/DocsApp";

/**
 * The demo app is the kit's documentation site (kit-docs). The splat route
 * hands the whole URL tree to DocsApp, which owns all routes (including the
 * not-found page) — the parent must carry the trailing "*" or the router
 * stops matching once the URL goes deeper than the root.
 *
 * BASE_URL is Vite's build base ("/" in dev, "/ui-kit/react/" in the Pages
 * build). Without it as the router basename, Link/navigate resolve against
 * the domain root and menu links land on https://cjlapao.github.io/overview
 * instead of https://cjlapao.github.io/ui-kit/react/overview.
 */
const basename = import.meta.env.BASE_URL.replace(/\/+$/, "");

export const App = () => {
  return (
    <BrowserRouter basename={basename || undefined}>
      <Routes>
        <Route path="/*" element={<DocsApp />} />
      </Routes>
    </BrowserRouter>
  );
};
