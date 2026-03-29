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

## Context Gates

Before writing code → read docs/conventions/brain-ui-conventions/memory.md
Before making decisions → read docs/decisions/brain-ui-decisions/memory.md
Before suggesting features → read docs/vision/brain-ui-vision/memory.md
For architecture questions → read docs/architecture/brain-ui-architecture/memory.md

## Idea Capture

When the developer mentions an idea unrelated to the current task ("oh we should also...", "what if we...", "remind me to..."), capture it immediately to Brain:

1. Acknowledge briefly: "Captured."
2. Use `brain.create_memory` with kind: "ideas", include context of current work
3. Return to current task — don't let capture become a conversation

## Post-Implementation Checks

After finishing any implementation — before reporting done:

1. Run `make check` on changed files — fix all errors
2. Self-review: did you follow conventions.md? Did you drift from what was asked?
3. If the change affects architecture/decisions/vision docs, flag it — don't update silently
4. Summary: what changed, gates passed, any concerns

## Shipwright

Skills: ../shipwright/skills/

## Conventions

- Use `resolve()` from `$app/paths` for all `href` attributes (typed routes)
- Use `{#each items as item (key)}` — always provide a key
- Use Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props`
- Custom colors use `brain-*` prefix (bg, surface, border, text, muted, accent, green, red)
- All API calls go through `src/lib/brain.ts` — never fetch Brain directly from components
