---
title: Brain UI Vision
summary: >-
  SvelteKit frontend for browsing, searching, and reading Shipwright Brain
  memories — ships bundled with npx shipwright init
kind: vision
tags:
  - brain-ui
  - vision
  - product
refs:
  - docs/ideas/brain-ui-sveltekit/memory.md
by: developer
at: '2026-03-29T12:12:13.968Z'
---

# Brain UI Vision

Brain UI is a lightweight web frontend for Shipwright Brain — it lets developers browse, search, and read the memories stored in their project's knowledge base.

## Who it's for

- **Developers using Shipwright** who want to see what's in Brain without using the CLI
- **Anyone debugging Brain** — see what's stored, what's connected, what's missing

## What success looks like

- Developer opens Brain UI, immediately sees all memory kinds and can drill down
- Search finds relevant memories fast
- Memory detail renders rich markdown with images, tags, and linked refs
- Eventually: graph view showing how memories connect (not MVP)

## Stack

- SvelteKit 2 + Svelte 5 (runes mode)
- TypeScript (strict)
- Tailwind CSS 4 + shadcn-svelte
- Consumes Brain HTTP API at localhost:3111

## API endpoints consumed

- GET /api/browse?path=&tags=&status=&limit=&offset=&sort=
- GET /api/search?q=&tags=&status=&sort=
- GET /api/memory?f={memory_file}
- GET /api/graph
- GET /api/overview
- GET /file?p={path} (attachment serving)

## Not in scope (yet)

- Creating or editing memories from the UI
- Authentication
- Multi-user / deployment beyond localhost
- Graph visualization
