---
title: MemoryCard compact layout for narrow containers via container queries
summary: >-
  Cards in board columns and dashboard are too wide — use CSS container queries
  to switch to compact layout (stacked, smaller text) when container is narrow
kind: ideas
tags:
  - brain-ui
  - ux
  - improvement
refs: []
by: developer
at: '2026-03-29T23:13:45.247Z'
---

## Key Points

- [x] Add `.card-container` with `container-type: inline-size` on board columns and dashboard
- [x] Use `@container (max-width: 350px)` to hide summary in narrow containers
- [x] Restructured card: badges + progress on first row, title on second row
- [x] Kind + category on left, progress/done on right with flex spacer
- [x] Full layout preserved for browse/search where cards have full width
- [x] Pure CSS — no prop needed

![compact-cards-dashboard.png](compact-cards-dashboard.png)

![compact-cards-board.png](compact-cards-board.png)
