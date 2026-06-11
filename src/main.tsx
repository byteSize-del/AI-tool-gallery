import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/sketch.css";

// In development, fail loud if the tool catalogue is malformed so a bad
// entry surfaces immediately instead of rendering as a broken card.
if (import.meta.env.DEV) {
  import("./data/categories").then(({ categories }) =>
    import("./data/schema").then(({ assertValidCategories }) => {
      try {
        assertValidCategories(categories);
      } catch (err) {
        console.error("⚠️ Invalid tool catalogue data:", err);
      }
    })
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
