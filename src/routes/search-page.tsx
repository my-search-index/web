import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Database, FileUp, Loader2, Search, X } from "lucide-react";
import { type FormEvent, useMemo } from "react";

import { listDocuments, searchDocuments, uploadDocuments } from "../services/core-api";
import { useSearchUiStore } from "../stores/search-ui-store";
import { Button } from "../ui/button";
import { highlightSnippet } from "../ui/highlight-snippet";

/**
 * Primary workspace for uploading documents and searching the indexed corpus.
 */
export function SearchPage() {
  const queryClient = useQueryClient();
  const query = useSearchUiStore((state) => state.query);
  const selectedFiles = useSearchUiStore((state) => state.selectedFiles);
  const setQuery = useSearchUiStore((state) => state.setQuery);
  const setSelectedFiles = useSearchUiStore((state) => state.setSelectedFiles);
  const clearFiles = useSearchUiStore((state) => state.clearFiles);

  const documentsQuery = useQuery({
    queryKey: ["documents"],
    queryFn: listDocuments,
  });

  const resultsQuery = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchDocuments(query),
    enabled: query.trim().length > 0,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocuments,
    onSuccess: async () => {
      clearFiles();
      await queryClient.invalidateQueries({ queryKey: ["documents"] });
      await queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });

  const totalTokens = useMemo(() => {
    return (documentsQuery.data ?? []).reduce((sum, doc) => sum + doc.Length, 0);
  }, [documentsQuery.data]);

  /**
   * Sends selected browser files to the core API.
   *
   * The API stores files server-side before indexing so snippets can be
   * extracted later.
   */
  function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      return;
    }
    uploadMutation.mutate(selectedFiles);
  }

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Search Index</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-slate-950">
              Document search workspace
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <Metric label="Documents" value={String(documentsQuery.data?.length ?? 0)} />
            <Metric label="Tokens" value={totalTokens.toLocaleString()} />
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4">
            <form className="flex gap-2" onSubmit={(event) => event.preventDefault()}>
              <label className="relative flex-1">
                <span className="sr-only">Search documents</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-base outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
                  placeholder="Search indexed documents"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              {query.length > 0 ? (
                <Button type="button" variant="secondary" size="icon" onClick={() => setQuery("")}>
                  <X className="size-4" />
                </Button>
              ) : null}
            </form>

            <div className="rounded-md border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div>
                  <h2 className="text-base font-semibold">Results</h2>
                  <p className="text-sm text-slate-500">
                    {query.trim() ? `Query: ${query.trim()}` : "Type a query to search"}
                  </p>
                </div>
                {resultsQuery.isFetching ? (
                  <Loader2 className="size-5 animate-spin text-slate-400" />
                ) : null}
              </div>

              <div className="divide-y divide-slate-100">
                {!query.trim() ? (
                  <EmptyState
                    title="Ready to search"
                    body="Upload documents, then search for exact terms."
                  />
                ) : null}
                {resultsQuery.isError ? (
                  <EmptyState title="Search failed" body={resultsQuery.error.message} />
                ) : null}
                {resultsQuery.data?.length === 0 ? (
                  <EmptyState
                    title="No matches"
                    body="Try another term or upload more documents."
                  />
                ) : null}
                {resultsQuery.data?.map((result) => (
                  <article className="p-4" key={result.Doc.ID}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-medium text-slate-950">{result.Doc.FilePath}</h3>
                        <p className="text-sm text-slate-500">
                          {result.Doc.Length.toLocaleString()} tokens
                        </p>
                      </div>
                      <span className="text-sm tabular-nums text-slate-500">
                        score {result.Score.toFixed(4)}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {result.Snippets?.map((snippet, index) => (
                        <p
                          className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700"
                          key={`${result.Doc.ID}-${index}`}
                        >
                          {highlightSnippet(snippet)}
                        </p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <form className="rounded-md border border-slate-200 bg-white p-4" onSubmit={onUpload}>
              <div className="flex items-center gap-2">
                <FileUp className="size-5 text-slate-500" />
                <h2 className="font-semibold">Upload documents</h2>
              </div>
              <label className="mt-4 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-500">
                <input
                  className="sr-only"
                  type="file"
                  multiple
                  accept=".txt,.md,text/plain,text/markdown"
                  onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
                />
                <span className="text-sm font-medium text-slate-700">Choose .txt or .md files</span>
                <span className="mt-1 text-xs text-slate-500">
                  Files are sent to the core API and indexed there.
                </span>
              </label>
              {selectedFiles.length > 0 ? (
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {selectedFiles.map((file) => (
                    <li
                      className="truncate rounded bg-slate-50 px-2 py-1"
                      key={`${file.name}-${file.size}`}
                    >
                      {file.name}
                    </li>
                  ))}
                </ul>
              ) : null}
              <Button
                className="mt-4 w-full"
                disabled={selectedFiles.length === 0 || uploadMutation.isPending}
                type="submit"
              >
                {uploadMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <FileUp className="size-4" />
                )}
                Index upload
              </Button>
              {uploadMutation.isError ? (
                <p className="mt-3 text-sm text-red-600">{uploadMutation.error.message}</p>
              ) : null}
            </form>

            <section className="rounded-md border border-slate-200 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                <Database className="size-5 text-slate-500" />
                <h2 className="font-semibold">Indexed documents</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {documentsQuery.data?.length === 0 ? (
                  <EmptyState title="No documents" body="Upload a document to begin." />
                ) : null}
                {documentsQuery.data?.map((doc) => (
                  <div className="px-4 py-3" key={doc.ID}>
                    <p className="truncate text-sm font-medium text-slate-800">{doc.FilePath}</p>
                    <p className="text-xs text-slate-500">{doc.Length.toLocaleString()} tokens</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

/**
 * Renders one compact dashboard counter.
 */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

/**
 * Keeps empty, loading-adjacent, and error panels visually consistent.
 */
function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{body}</p>
    </div>
  );
}
