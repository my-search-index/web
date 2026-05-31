import { expect, test } from "@playwright/test";

test("renders the search workspace", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Document search workspace" })).toBeVisible();
  await expect(page.getByText("Upload documents")).toBeVisible();
  await expect(page.getByPlaceholder("Search indexed documents")).toBeVisible();
});
