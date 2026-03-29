---
title: Homepage dashboard with recent memories by status
summary: >-
  Show last 3 modified memories per status (not-started, in-progress, done) on
  homepage as a mini dashboard with counts
kind: ideas
tags:
  - brain-ui
  - feature
  - ux
refs:
  - docs/features/brain-ui-features/browse/memory.md
by: developer
at: '2026-03-29T22:31:10.779Z'
---

## Key Points

- [x] Fetch 3 most recently modified memories per status (not-started, in-progress, done)
- [x] Uses searchMemories with sort=modified:desc + status filter
- [x] Show as three columns on homepage below the kind list
- [x] Each section shows label + count + up to 3 MemoryCards with kind badge
- [x] Responsive — stacks on mobile (grid-cols-1 md:grid-cols-3)

![homepage-dashboard.png](homepage-dashboard.png)
