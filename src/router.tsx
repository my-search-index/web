import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

import { SearchPage } from "./routes/search-page";

/**
 * Root route for the current single-page workspace.
 *
 * Keeping TanStack Router in place gives future routes typed params and search
 * state when the app grows.
 */
const rootRoute = createRootRoute({
  component: SearchPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: SearchPage,
});

const routeTree = rootRoute.addChildren([indexRoute]);

/**
 * Application router imported by `main.tsx`.
 *
 * It is also registered below for TanStack Router's type inference.
 */
export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
