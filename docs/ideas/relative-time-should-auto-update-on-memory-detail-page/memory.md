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

- [x] Add a 30s interval timer (`timeTick` state) that triggers re-render of relative timestamps
- [x] "just now" → "Xm ago" → "Xh ago" auto-updates as time passes
