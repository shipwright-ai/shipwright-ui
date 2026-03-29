---
title: >-
  Markdown links to memory.md files resolve as file downloads instead of
  navigation
summary: >-
  Relative links like [Browse](browse/memory.md) in content get rewritten to
  Brain file API download URLs instead of /memory/ navigation links
kind: ideas
tags:
  - brain-ui
  - bug
refs:
  - docs/ideas/clean-memory-urls-with-path-route/memory.md
by: developer
at: '2026-03-29T21:45:09.842Z'
---

## Background

The markdown content rewriter catches all relative file links and rewrites them to Brain's file download API. But links to `memory.md` files should navigate to the memory detail view instead.

## Fix

- [x] Check if href ends with `/memory.md` or equals `memory.md`
- [x] If so, resolve to `/memory/{resolved-path}` instead of `fileUrl()`
