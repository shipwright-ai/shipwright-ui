---
title: Category icons on tag filter buttons in browse/search
summary: >-
  Tags that match categories (bug, feature, improvement, etc.) should show their
  Lucide icon in the tag filter bar, not just on cards
kind: ideas
tags:
  - brain-ui
  - ux
  - improvement
refs: []
by: developer
at: '2026-03-29T22:31:49.853Z'
---

## Key Points

- [ ] In tag filter bar, detect if a tag is a category (bug, feature, improvement, etc.)
- [ ] If so, render the corresponding Lucide icon next to the tag name
- [ ] Reuse detectCategory + CATEGORIES icon mapping from categories.ts
