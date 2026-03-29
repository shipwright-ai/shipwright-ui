---
title: Expand single-memory kinds inline on homepage
summary: >-
  Kinds with count=1 should show memory title, summary, and modified date inline
  — click goes directly to detail instead of browse
kind: ideas
tags:
  - brain-ui
  - ux
  - improvement
refs: []
by: developer
at: '2026-03-29T16:52:39.344Z'
---

# Expand single-memory kinds inline on homepage

> Context: kinds with 1 memory (Architecture, Conventions, etc) force a useless browse step

## Layout

- Multi-memory kinds (count > 1): show as cards, link to browse (current behavior)
- Single-memory kinds (count = 1): show inline with title, summary, modified date — link directly to memory detail
- Sort: multi-memory kinds first, then singles

## Steps

- [x] Fetch single-memory kind data on homepage (parallel browse calls)
- [x] Render singles as expanded cards with kind label + title + summary
- [x] Link directly to /memory/[...path] instead of /browse
- [x] Sort: multi-memory kinds first (grid), then singles (list)

![current-homepage.png](current-homepage.png)

![homepage-with-singles-expanded.png](homepage-with-singles-expanded.png)
