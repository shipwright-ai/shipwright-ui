---
title: 'Clean memory URLs with [...path] route'
summary: >-
  Replace ugly encoded URLs (/memory/docs%2Fideas%2F...) with clean paths
  (/memory/docs/ideas/.../memory.md)
kind: ideas
tags:
  - brain-ui
  - ux
  - routing
refs:
  - >-
    docs/ideas/markdown-links-to-memory-md-files-resolve-as-file-downloads-/memory.md
by: developer
at: '2026-03-29T16:33:47.520Z'
---

# Clean memory URLs with [...path] route

> Context: current URLs are /memory/docs%2Fideas%2Fcmd-k-search%2Fmemory.md — ugly encoded slashes

- [x] Change route from /memory/[file] to /memory/[...path]
- [x] URL becomes /memory/docs/ideas/cmd-k-search/memory.md
- [x] Update all href generation in browse, search, and memory detail
- [x] No encodeURIComponent needed — path segments are natural URL segments

![clean-url-working.png](clean-url-working.png)
