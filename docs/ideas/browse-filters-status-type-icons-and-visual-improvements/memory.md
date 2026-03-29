---
title: 'Browse filters: status, type icons, and visual improvements'
summary: >-
  Add status filter buttons (planned/in-progress/done), type icons
  (feature/bug/improvement), and card styling by status
kind: ideas
tags:
  - brain-ui
  - ux
  - filters
  - browse
refs:
  - docs/ideas/api-pagination-with-tag-status-facets/memory.md
by: developer
at: '2026-03-29T13:49:53.166Z'
---

# Browse filters: status, type icons, and visual improvements

> Context: ideas list shows all items equally — need to filter by status and distinguish types visually

## Status filters

- [x] Add filter bar above memory list: All / Planned / In Progress / Done
- [x] Client-side filter on progress.status (shows only when memories have checkboxes)
- [x] Active filter button highlighted with status color
- [x] Card styling changes by status (done=dimmed, in-progress=amber left border)

## Type badges (from tags)

Tags are the source: bug, feature, improvement, epic, research, chore.
No title prefix stripping — just detect from tags and show colored badge.

- [x] Created categories.ts with detectCategory() from tags
- [x] Created CategoryBadge.svelte shared component
- [x] Show colored badge: red=bug, blue=feature, green=improvement, purple=epic, cyan=research, gray=chore
- [ ] Show lucide icon next to badge
- [ ] Filter by type in addition to status
- [x] Add category badges to search results and memory detail
- [x] Cascading tag filters: only show tags available given current status/tag selection

## Visual polish

- [x] Done cards slightly dimmed (opacity-60)
- [x] In-progress cards with amber left border
- [x] Planned cards neutral
