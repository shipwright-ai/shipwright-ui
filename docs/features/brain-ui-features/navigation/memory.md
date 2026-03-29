---
title: Navigation
summary: >-
  Header with status dot, breadcrumbs, command palette (Cmd+K), inline search,
  theme switcher
kind: features
tags:
  - brain-ui
refs: []
by: developer
at: '2026-03-29T21:38:45.363Z'
---

## Components

- `src/lib/components/Header.svelte`
- `src/lib/components/CommandPalette.svelte`

## Capabilities

- **Header** — sticky top bar with brain icon (links to home), "shipwright brain" title, inline search input, theme toggle, connection status dot (green=connected, red=disconnected)
- **Breadcrumbs** — contextual navigation on browse and memory detail pages (home / kind / title)
- **Command palette** — Cmd+K opens search overlay for quick navigation
- **Theme switcher** — cycles dark / system / light with icon indicator
- **Clean URLs** — `/memory/docs/ideas/foo/memory.md` instead of encoded paths

![header-navigation.png](header-navigation.png)

![unified-homepage.png](unified-homepage.png)
