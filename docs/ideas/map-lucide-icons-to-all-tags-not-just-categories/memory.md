---
title: 'Map Lucide icons to all tags, not just categories'
summary: >-
  Every tag should have a Lucide icon — map common tags to icons (ux, styling,
  search, images, etc.) and auto-suggest icons for new tags
kind: ideas
tags:
  - brain-ui
  - feature
  - ux
refs:
  - docs/ideas/category-icons-on-tag-filter-buttons-in-browse-search/memory.md
by: developer
at: '2026-03-29T22:54:08.688Z'
---

## Key Points

- [x] Created TAG_ICON_MAP in tagIcons.ts mapping tag names to Lucide icon names
- [x] Created TagIcon.svelte component that renders icon by tag name
- [x] Applied to browse and search tag filter bars
- [x] Icons rendered at 40% opacity to not compete with text
- [x] Counts also at 40% opacity for cleaner look
- [x] Fallback: no icon if no match

![tag-icons-all.png](tag-icons-all.png)
