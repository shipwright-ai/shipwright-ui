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
refs: []
by: developer
at: '2026-03-29T17:16:18.096Z'
---

# Display and interlink refs in memory detail

> Context: Brain stores refs (related memory_file paths) in frontmatter but brain-ui doesn't display them

- [x] Show refs section in memory detail (after content, before children)
- [x] Display as linked cards with slug name + full path
- [ ] Fetch ref titles from Brain API instead of parsing slug
- [ ] Bidirectional: show "referenced by" as well (if Brain API supports it)

![refs-displayed.png](refs-displayed.png)
