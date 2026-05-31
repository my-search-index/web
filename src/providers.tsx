import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";

import type { router } from "./router";

/**
 * Props required to mount the app-level providers.
 */
export type AppProvidersProps = {
  /**
   * TanStack Router instance used by the application.
   */
  router: typeof router;
};

/**
 * Owns app-wide React providers that should be created once per browser
 * session.
 */
export function AppProviders(props: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={props.router} />
    </QueryClientProvider>
  );
}
