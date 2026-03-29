---
title: Brain UI Architecture
summary: >-
  SvelteKit SPA with client-side fetching from Brain HTTP API, distributed as
  part of npx shipwright init
kind: architecture
tags:
  - brain-ui
  - architecture
  - sveltekit
refs:
  - docs/ideas/cmd-k-search-popup-with-autocomplete/memory.md
by: developer
at: '2026-03-29T12:12:13.987Z'
---

# Architecture

## Overview

Brain UI is a SvelteKit SPA that consumes Brain's HTTP API. No server-side data fetching — all API calls happen client-side via `onMount` / `$effect`.

```
Browser  →  SvelteKit (localhost:5173)  →  Brain API (localhost:3111)
                                              ↓
                                         Memory files on disk
```

## Key modules

- **`src/lib/brain.ts`** — Single API client. All routes go through this. Never fetch Brain directly from components.
- **`src/lib/components/`** — Shared UI (Header with connection status dot)
- **`src/routes/`** — File-based routing: landing → browse → detail, plus search

## Data flow

1. Page mounts, calls `brain.ts` function (e.g. `browseRoot()`)
2. `brain.ts` fetches from Brain API using URL from localStorage (default: localhost:3111)
3. Response typed via TypeScript interfaces, rendered in component
4. Images in markdown rewritten to proxy through Brain's `/file?p=` endpoint

## Distribution

Brain UI ships as part of `npx shipwright init` — not as a standalone project. The install command bundles:

1. **Shipwright** — scaffolding, skills, hooks, CLAUDE.md
2. **Brain** — persistent memory server
3. **Brain UI** — web frontend for browsing memories

Brain starts automatically when needed. Brain UI starts separately on demand (`npx shipwright ui` or a make target) — developers open it when they want to browse/search their knowledge base.

Brain UI must be designed to work as a bundled dependency: no special setup, no separate config, just works when Shipwright is installed.

## External dependencies

- **Brain HTTP API** (localhost:3111) — the only external dependency
- No database, no auth, no other services

## Brain API endpoints consumed

- `GET /api/browse` — list kinds or memories within a kind
- `GET /api/search?q=` — full-text search
- `GET /api/memory?f=` — single memory detail with markdown content
- `GET /api/overview` — stats
- `GET /file?p=` — serve attachments/images
