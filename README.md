# Search Index Web

React SPA for the Search Index core API.

## Stack

- Vite 8 + React + TypeScript
- pnpm
- Tailwind CSS 4
- shadcn-style local components
- TanStack Router
- TanStack Query
- Zustand
- Zod
- Oxlint + Oxfmt
- Vitest + Testing Library
- Playwright
- MSW

Sentry is intentionally not configured yet.

## Run

```sh
pnpm install
pnpm dev
```

Create `.env.local` when the core API is not running on the default URL:

```sh
VITE_CORE_API_URL=http://localhost:8080
```

## Scripts

```sh
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm format
pnpm storybook
```
