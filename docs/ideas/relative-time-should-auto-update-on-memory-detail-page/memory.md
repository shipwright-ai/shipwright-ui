---
title: Relative time should auto-update on memory detail page
summary: >-
  The "just now" / "6m ago" relative timestamps on memory detail should tick and
  update over time, not stay frozen from initial render
kind: ideas
tags:
  - brain-ui
  - ux
refs: []
by: developer
at: '2026-03-30T09:10:21.879Z'
---

## Key Points

- [ ] Add a periodic timer that re-computes relative timestamps (e.g. every 30s)
- [ ] "just now" → "30s ago" → "1m ago" → "5m ago" etc.
