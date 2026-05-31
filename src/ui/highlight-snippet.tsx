import type { ReactNode } from "react";

import type { Snippet } from "../services/core-api";

/**
 * Converts backend match offsets into renderable React nodes.
 *
 * The core API reports `Start` and `End` offsets relative to `Snippet.Text`.
 * This helper preserves all unmatched text and wraps each matched range in a
 * `<mark>` element.
 *
 * @param snippet - Snippet payload returned by the core API.
 */
export function highlightSnippet(snippet: Snippet): ReactNode[] {
  if (snippet.Matches.length === 0) {
    return [snippet.Text];
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;

  snippet.Matches.forEach((match, index) => {
    if (match.Start > cursor) {
      nodes.push(snippet.Text.slice(cursor, match.Start));
    }

    nodes.push(
      <mark
        className="rounded bg-[#fff4c4] px-0.5 text-[#111827]"
        key={`${match.Term}-${match.Start}-${index}`}
      >
        {snippet.Text.slice(match.Start, match.End)}
      </mark>,
    );
    cursor = match.End;
  });

  if (cursor < snippet.Text.length) {
    nodes.push(snippet.Text.slice(cursor));
  }

  return nodes;
}
