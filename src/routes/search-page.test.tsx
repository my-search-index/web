import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SearchPage } from "./search-page";

describe("SearchPage", () => {
  it("searches documents and renders highlighted snippets", async () => {
    renderSearchPage();

    await screen.findByText("uploads/web-crawler.txt");

    await userEvent.type(screen.getByPlaceholderText("Search indexed documents"), "distributed");

    expect(await screen.findByText("score 0.4200")).toBeInTheDocument();
    expect(screen.getByText("distributed")).toHaveTextContent("distributed");
  });
});

function renderSearchPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SearchPage />
    </QueryClientProvider>,
  );
}
