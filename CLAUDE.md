# Brain UI

Web UI for Shipwright Brain — browse, search, and read memories stored in Brain's knowledge base.

## Stack

- **Framework:** SvelteKit 2 + Svelte 5 (runes mode)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 + shadcn-svelte (zinc theme, dark mode)
- **Font:** JetBrains Mono
- **Markdown:** marked
- **Testing:** Vitest
- **Linting:** ESLint + Prettier

## Commands

```
make dev        # Start dev server (localhost:5173)
make check      # Lint + typecheck (run before every commit)
make test       # Run unit tests
make format     # Auto-format with prettier
make build      # Production build
make help       # Show all targets
```

## Gate: make check

Every change MUST pass `make check` before being committed. This runs prettier, eslint, and svelte-check. Fix all errors — do not disable rules without a comment explaining why.

## Architecture

- `src/lib/brain.ts` — Brain HTTP API client (configurable URL, defaults to localhost:3111)
- `src/lib/components/` — Shared UI components (Header with status dot)
- `src/routes/` — SvelteKit file-based routing:
  - `/` — Landing page, lists memory kinds
  - `/browse/[...path]` — Browse memories by kind/path
  - `/memory/[file]` — Memory detail with rendered markdown
  - `/search` — Full-text search across memories

## Conventions

- Use `resolve()` from `$app/paths` for all `href` attributes (typed routes)
- Use `{#each items as item (key)}` — always provide a key
- Use Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props`
- Custom colors use `brain-*` prefix (bg, surface, border, text, muted, accent, green, red)
- All API calls go through `src/lib/brain.ts` — never fetch Brain directly from components
