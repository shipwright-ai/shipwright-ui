---
title: Display and interlink refs in memory detail
summary: >-
  Refs in frontmatter are not displayed — should show as linked related memories
  in the detail view
kind: ideas
tags:
  - brain-ui
  - feature
  - ux
refs:
  - >-
    docs/ideas/fix-memory-detail-crashes-on-refs-with-missing-tags-title/memory.md
  - docs/ideas/sub-memory-refs-show-as-deleted-in-parent-detail-view/memory.md
by: developer
at: '2026-03-29T17:16:18.096Z'
---

# Display and interlink refs in memory detail

> Context: Brain stores refs (related memory_file paths) in frontmatter but brain-ui doesn't display them

- [x] Show refs section in memory detail (after content, before children)
- [x] Display as linked cards with slug name + full path
- [x] Brain API: return refs as full objects (title, summary, tags, progress, kind)
- [x] Brain API: return referencedBy (back-refs) — Brain now auto-updates refs bidirectionally
- [x] UI: render refs as rich cards with kind, category badge, progress badge
- [x] UI: use full objects from API

![refs-displayed.png](refs-displayed.png)

![refs-section-showing.png](refs-section-showing.png)

![rich-refs-with-badges.png](rich-refs-with-badges.png)
