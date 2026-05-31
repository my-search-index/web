import { z } from "zod";

const apiBaseUrl = import.meta.env.VITE_CORE_API_URL ?? "http://localhost:8080";

// documentSchema mirrors the core API Document payload.
const documentSchema = z.object({
  ID: z.number(),
  FilePath: z.string(),
  Length: z.number(),
});

// matchSchema describes one highlight range inside a snippet.
const matchSchema = z.object({
  Start: z.number(),
  End: z.number(),
  Term: z.string(),
});

// snippetSchema normalizes nullable snippet matches into an empty array so UI
// rendering never has to branch on null.
const snippetSchema = z.object({
  Text: z.string(),
  Matches: z
    .array(matchSchema)
    .nullable()
    .optional()
    .transform((matches) => matches ?? []),
});

// resultSchema mirrors the core API Result payload and normalizes missing
// snippets into an empty array.
const resultSchema = z.object({
  Doc: documentSchema,
  Snippets: z
    .array(snippetSchema)
    .nullable()
    .optional()
    .transform((snippets) => snippets ?? []),
  Score: z.number(),
});

const errorEnvelopeSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
});

const successEnvelopeSchema = z.object({
  ok: z.literal(true),
  data: z.unknown(),
});

/**
 * A backend-stored file that has been added to the search index.
 */
export type IndexedDocument = z.infer<typeof documentSchema>;

/**
 * A ranked search hit returned by the core API.
 */
export type SearchResult = z.infer<typeof resultSchema>;

/**
 * Display text plus exact match ranges for highlighting.
 */
export type Snippet = z.infer<typeof snippetSchema>;

/**
 * Returns all documents currently known by the core API.
 */
export async function listDocuments(): Promise<IndexedDocument[]> {
  return request("/api/v1/documents", z.array(documentSchema));
}

/**
 * Runs a query against the core index.
 *
 * @param query - Search terms typed by the user.
 */
export async function searchDocuments(query: string): Promise<SearchResult[]> {
  const params = new URLSearchParams({ q: query });
  return request(`/api/v1/search?${params.toString()}`, z.array(resultSchema));
}

/**
 * Sends real file bytes to the backend for storage and indexing.
 *
 * The core API stores uploaded files before indexing them so snippets can
 * reopen the backend-local copy later.
 *
 * @param files - Browser File objects selected by the user.
 */
export async function uploadDocuments(files: File[]): Promise<IndexedDocument[]> {
  const form = new FormData();
  for (const file of files) {
    form.append("files", file);
  }

  return request("/api/v1/documents", z.array(documentSchema), {
    method: "POST",
    body: form,
  });
}

/**
 * Centralizes fetch, API envelope handling, and runtime validation.
 *
 * TypeScript cannot prove that the backend response matches our types at
 * runtime, so every successful response is parsed with the caller's Zod schema.
 */
async function request<T extends z.ZodType>(
  path: string,
  dataSchema: T,
  init?: RequestInit,
): Promise<z.infer<T>> {
  const response = await fetch(`${apiBaseUrl}${path}`, init);
  const payload: unknown = await response.json();

  const errorEnvelope = errorEnvelopeSchema.safeParse(payload);
  if (errorEnvelope.success) {
    throw new Error(errorEnvelope.data.error);
  }

  const successEnvelope = successEnvelopeSchema.safeParse(payload);
  if (!successEnvelope.success) {
    throw new Error("Unexpected API response");
  }

  return dataSchema.parse(successEnvelope.data.data);
}
