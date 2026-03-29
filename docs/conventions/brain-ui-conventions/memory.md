---
title: Brain UI Conventions
summary: >-
  Coding conventions: Svelte 5 runes, brain-* colors, centralized API client,
  file organization patterns
kind: conventions
tags:
  - brain-ui
  - conventions
  - code-style
refs: []
by: developer
at: '2026-03-29T12:12:15.963Z'
---

# Conventions

## File organization

- Routes in `src/routes/` following SvelteKit file-based routing
- Shared components in `src/lib/components/`
- API client in `src/lib/brain.ts` — the only module that talks to Brain
- Global styles in `src/routes/layout.css`

## Component patterns

- Use Svelte 5 runes: `$state`, `$derived`, `$effect`, `$props`
- Every `{#each}` must have a key: `{#each items as item (item.id)}`
- Use `resolve()` from `$app/paths` for all `href` attributes
- Pages follow: fetch on mount → loading state → error state → render

## Styling

- Tailwind CSS 4 utility classes
- Custom colors use `brain-*` prefix (bg, surface, border, text, muted, accent, green, red)
- Dark mode is the only mode — all colors designed for dark backgrounds
- Responsive grids: mobile-first (1 col → 2 col → 3 col)
- Typography plugin for rendered markdown (`prose prose-sm prose-invert`)

## API integration

- All Brain API calls go through `src/lib/brain.ts`
- Never fetch Brain directly from components
- All responses are typed via TypeScript interfaces in brain.ts
- Image URLs in markdown content get rewritten to proxy through Brain's `/file?p=` endpoint

## Naming

- Components: PascalCase (`Header.svelte`)
- Files/routes: kebab-case or SvelteKit param syntax (`[...path]`, `[file]`)
- CSS custom properties: `--color-brain-*`
- TypeScript interfaces: PascalCase (`MemoryDetail`, `BrowseRootResponse`)

## Testing

- Vitest for unit tests
- Test files alongside source or in `src/lib/vitest-examples/`

## Quality gate

- `make check` before every commit — runs prettier, eslint, svelte-check
- No disabled lint rules without a comment explaining why
