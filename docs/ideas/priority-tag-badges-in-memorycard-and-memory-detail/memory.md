---
title: Priority tag badges in MemoryCard and memory detail
summary: >-
  Add colored icon badges for priority tags (low/medium/high/urgent/blocker)
  next to memory titles in MemoryCard and memory detail page.
kind: ideas
tags:
  - brain-ui
  - ux
  - tags
  - feature
refs:
  - docs/ideas/progress-bar-on-top-of-memory-cards-in-browse-view/memory.md
by: developer
at: '2026-03-30T22:31:12.344Z'
---

## Background

When scanning memory lists, priority is buried in the tag list. Adding a colored icon badge next to the title makes priority immediately visible.

## Checklist

- [x] Create `PriorityBadge.svelte` component with icon + color per level
  - low: muted, arrow-down icon
  - medium: blue, minus icon
  - high: amber, arrow-up icon
  - urgent: orange, alert-triangle icon
  - blocker: red, octagon-alert icon
- [x] Add helper to extract priority from tags (e.g. `priority/high` → `high`)
- [x] Show PriorityBadge next to title in `MemoryCard.svelte`
- [x] Show PriorityBadge next to title in memory detail page (`/memory/[...path]`)
- [x] Filter priority tags out of the regular tag display (avoid duplication)

## Scope

- **Where:** `MemoryCard.svelte` and `src/routes/memory/[...path]/+page.svelte`
- **Tags format:** `priority/low`, `priority/medium`, `priority/high`, `priority/urgent`, `priority/blocker`
- **Style:** Similar to `CategoryBadge` — inline icon + label, color-coded
