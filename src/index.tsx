import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

import "./styles/main.css";

const container: HTMLElement | null = document.getElementById("root");

if (container) {
  const root = createRoot(container);

  root.render(
    <Router>
      <App></App>
    </Router>
  );
} else {
  console.log("Root container not found!");
}
