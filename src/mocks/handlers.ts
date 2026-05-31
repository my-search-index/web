import { http, HttpResponse } from "msw";

const apiBaseUrl = import.meta.env.VITE_CORE_API_URL ?? "http://localhost:8080";

export const handlers = [
  http.get(`${apiBaseUrl}/api/v1/documents`, () => {
    return HttpResponse.json({
      ok: true,
      data: [
        {
          ID: 1,
          FilePath: "uploads/web-crawler.txt",
          Length: 3797,
        },
      ],
    });
  }),
  http.get(`${apiBaseUrl}/api/v1/search`, () => {
    return HttpResponse.json({
      ok: true,
      data: [
        {
          Doc: {
            ID: 1,
            FilePath: "uploads/web-crawler.txt",
            Length: 3797,
          },
          Snippets: [
            {
              Text: "distributed web crawlers coordinate work across hosts",
              Matches: [{ Start: 0, End: 11, Term: "distributed" }],
            },
          ],
          Score: 0.42,
        },
      ],
    });
  }),
  http.post(`${apiBaseUrl}/api/v1/documents`, () => {
    return HttpResponse.json(
      {
        ok: true,
        data: [
          {
            ID: 2,
            FilePath: "uploads/new-document.txt",
            Length: 12,
          },
        ],
      },
      { status: 201 },
    );
  }),
];
