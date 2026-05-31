import { create } from "zustand";

/**
 * Browser-only UI state for the search workspace.
 */
export type SearchUiState = {
  /**
   * Current search input value.
   */
  query: string;
  /**
   * Files selected in the upload control before submission.
   */
  selectedFiles: File[];
  /**
   * Replaces the current search query.
   */
  setQuery: (query: string) => void;
  /**
   * Replaces the currently selected upload files.
   */
  setSelectedFiles: (files: File[]) => void;
  /**
   * Clears selected upload files after a successful upload.
   */
  clearFiles: () => void;
};

/**
 * Zustand store for browser-only UI state.
 *
 * API data remains in TanStack Query; this store only tracks local controls
 * such as the search input and selected files.
 */
export const useSearchUiStore = create<SearchUiState>((set) => ({
  query: "",
  selectedFiles: [],
  setQuery: (query) => set({ query }),
  setSelectedFiles: (selectedFiles) => set({ selectedFiles }),
  clearFiles: () => set({ selectedFiles: [] }),
}));
