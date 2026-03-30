---
title: Show planned/in-progress/done counts on homepage kind cards
summary: >-
  Homepage kind cards with progress should show status breakdown (e.g. 3
  planned, 2 in progress, 42 done) instead of just the checkbox ratio
kind: ideas
tags:
  - brain-ui
  - ux
refs:
  - docs/ideas/progress-bar-on-top-of-memory-cards-in-browse-view/memory.md
  - docs/ideas/hide-progress-bar-on-homepage-when-kind-status-is-done/memory.md
  - docs/ideas/show-done-label-when-all-checkboxes-complete/memory.md
by: developer
at: '2026-03-30T09:15:36.271Z'
---

## Key Points

- [x] Fetch per-kind facets for kinds with progress (browseKind returns status facets)
- [x] Show "X planned", "X active", "X done" right-aligned on kind cards — color-coded
- [x] Only show for multi-memory kinds with progress data

![status-counts-on-homepage.png](status-counts-on-homepage.png)
