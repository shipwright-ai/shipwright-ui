---
title: Sub-memory refs show as "deleted" in parent detail view
summary: >-
  Brain returns children as refs with short relative paths — UI can't resolve
  them and shows "deleted" badges. Fixed by filtering refs that match children.
kind: ideas
tags:
  - brain-ui
  - bug
refs:
  - docs/ideas/display-and-interlink-refs-in-memory-detail/memory.md
by: developer
at: '2026-03-29T21:45:07.192Z'
---

## Background

When a parent memory has children (sub-memories), Brain's API returns those children as refs too — but with short relative paths like `browse/memory.md` instead of full paths. The UI couldn't resolve them, so they appeared as "deleted" refs with red borders.

## Fix

- [x] Filter refs that match children paths (exact or suffix match) before rendering
- [x] Only show refs that are genuinely external related memories
