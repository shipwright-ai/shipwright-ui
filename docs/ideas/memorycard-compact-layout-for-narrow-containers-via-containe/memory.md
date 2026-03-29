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

- [ ] Add `container-type: inline-size` on board columns and dashboard sections
- [ ] Use `@container` queries in MemoryCard to switch layout when < ~300px
- [ ] Compact: title stacks above badges, smaller text, hide summary
- [ ] Keep full layout for browse/search where cards have full width
- [ ] Works automatically — no prop needed, pure CSS adaptation
