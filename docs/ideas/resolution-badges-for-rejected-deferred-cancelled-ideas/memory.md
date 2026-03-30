---
title: Resolution badges for rejected/deferred/cancelled ideas
summary: >-
  Add ResolutionBadge component for dropped/deferred/rejected/cancelled/wontfix
  tags with dimmed card styling, same pattern as PriorityBadge
kind: ideas
tags:
  - feature
  - ui
  - high
refs: []
by: developer
at: '2026-03-30T22:47:32.165Z'
---

## Background

> Why: Ideas that are dropped, deferred, rejected, or cancelled need clear visual distinction — currently they look the same as active ideas.
> What: ResolutionBadge component + card dimming for resolution tags, following the PriorityBadge pattern.

## Plan

- [x] Capture idea
- [x] Create `src/lib/resolution.ts` — type, extraction, tag filtering (same pattern as priority.ts)
- [x] Create `src/lib/components/ResolutionBadge.svelte` — badge with icon + color per resolution
- [x] Update MemoryCard to extract resolution, show badge, dim card when resolved
- [x] Update `displayTags` to also filter out resolution tags
- [x] Update memory detail page with resolution badge support
- [x] Remove borders from all badges (cleaner look)
- [x] Move progress/done to first position in badge row
- [x] Add priority + resolution icons to TagIcon
- [x] Run `make check`

## Resolution Levels

| Tag       | Icon      | Color      | Meaning                               |
| --------- | --------- | ---------- | ------------------------------------- |
| dropped   | CircleOff | zinc-500   | Explored, decided not worth pursuing  |
| deferred  | Clock     | blue-400   | Postponed for later                   |
| rejected  | XCircle   | red-400    | Reviewed and declined                 |
| cancelled | Ban       | orange-400 | Was in progress, stopped              |
| wontfix   | ShieldOff | zinc-500   | Known issue, intentionally not fixing |
| duplicate | Copy      | zinc-500   | Already covered elsewhere             |

## Card Styling

Cards with a resolution tag get dimmed similar to done items — reduced opacity, muted border. The resolution badge shows inline with category + priority badges.
