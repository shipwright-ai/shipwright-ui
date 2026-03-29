---
title: Breadcrumbs for nested/sub-memories should show parent
summary: >-
  Sub-memory breadcrumbs show home/kind/title but should include parent memory
  in the path — API already returns parent field
kind: ideas
tags:
  - brain-ui
  - ux
  - bug
refs: []
by: developer
at: '2026-03-29T21:44:00.571Z'
---

## Background

Sub-memory breadcrumbs currently show `home / features / Browse` but should show `home / features / Brain UI Features / Browse`. The API already returns a `parent` field with the parent's `memory_file` path.

## Fix needed

- [x] Parse full path from memory_file — derive breadcrumb segments by deslugifying path parts
- [x] Show entire path hierarchy in breadcrumbs, not just parent
- [x] Each segment links to its corresponding memory or browse path
- [x] Example: home / features / brain ui features / Browse

![nested-breadcrumbs.png](nested-breadcrumbs.png)
