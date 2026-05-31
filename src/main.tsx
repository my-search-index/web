import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppProviders } from "./providers";
import { router } from "./router";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders router={router} />
  </StrictMode>,
);
