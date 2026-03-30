---
title: 'MemoryCard — remove empty badge space, float progress right'
summary: >-
  When a card has no category badge there's empty space; progress/done badge
  should float right to avoid squeezing long titles
kind: ideas
tags:
  - brain-ui
  - ux
refs:
  - >-
    docs/ideas/fix-memory-detail-title-wrapping-badges-squeeze-title-text/memory.md
  - docs/ideas/progress-bar-on-top-of-memory-cards-in-browse-view/memory.md
by: developer
at: '2026-03-30T09:13:42.317Z'
---

## Key Points

- [x] Only show badge row when there's a category or kind to display — no empty space
- [x] Progress/done badge floats right on the title row using flex with min-w-0

![card-layout-fixed.png](card-layout-fixed.png)
