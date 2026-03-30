---
title: Progress bar on top of memory cards in browse view
summary: >-
  Add a thin progress bar on top of browse cards showing checkbox completion
  percentage — visual indicator alongside the badge
kind: ideas
tags:
  - brain-ui
  - ux
  - feature
refs:
  - docs/ideas/show-done-label-when-all-checkboxes-complete/memory.md
  - docs/ideas/hide-progress-bar-on-homepage-when-kind-status-is-done/memory.md
  - >-
    docs/ideas/memorycard-remove-empty-badge-space-float-progress-right/memory.md
  - >-
    docs/ideas/show-planned-in-progress-done-counts-on-homepage-kind-cards/memory.md
by: developer
at: '2026-03-29T21:50:42.437Z'
---

## Background

Cards with progress badges show a fraction like 5/6 but lack a visual bar. A thin progress bar on top of each card would give an instant visual sense of completion.

## Key Points

- [x] Add thin colored bar at top of MemoryCard when progress exists
- [x] Color: green for done, amber for in-progress, gray for not-started
- [x] Width proportional to checked/total percentage
- [x] Also applicable to homepage — dashboard shows status counts + cards per status
- [x] Subtle — should not dominate the card
- [x] Remove redundant amber left border for in-progress (progress bar replaces it)
- [x] Done cards show "done" text on right side instead of DONE badge
- [x] Clean up tag styling — no bg/border on inactive tags

![progress-bars-clean.png](progress-bars-clean.png)
