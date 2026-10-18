import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DocsApp } from "./kit-docs/DocsApp";

/**
 * The demo app is the kit's documentation site (kit-docs). The splat route
 * hands the whole URL tree to DocsApp, which owns all routes (including the
 * not-found page) — the parent must carry the trailing "*" or the router
 * stops matching once the URL goes deeper than the root.
 */
export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<DocsApp />} />
      </Routes>
    </BrowserRouter>
  );
};
