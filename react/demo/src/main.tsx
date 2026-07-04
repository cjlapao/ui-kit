import React from "react";
import ReactDOM from "react-dom/client";
import { BottomSheetProvider } from "@cjlapao/ui-kit";
import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BottomSheetProvider>
      <App />
    </BottomSheetProvider>
  </React.StrictMode>,
);
