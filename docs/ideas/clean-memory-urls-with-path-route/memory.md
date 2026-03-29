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
refs: []
by: developer
at: '2026-03-29T16:33:47.520Z'
---

# Clean memory URLs with [...path] route

> Context: current URLs are /memory/docs%2Fideas%2Fcmd-k-search%2Fmemory.md — ugly encoded slashes

- [ ] Change route from /memory/[file] to /memory/[...path]
- [ ] URL becomes /memory/docs/ideas/cmd-k-search/memory.md
- [ ] Update all href generation to use path segments instead of encodeURIComponent
- [ ] Update brain.ts getMemory to accept path and reconstruct memory_file
