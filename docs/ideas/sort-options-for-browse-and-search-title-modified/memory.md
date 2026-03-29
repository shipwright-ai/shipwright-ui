---
title: 'Sort options for browse and search (title, modified)'
summary: >-
  Brain API now supports sorting by title and modified date (asc/desc) — add
  sort controls to browse and search views
kind: ideas
tags:
  - brain-ui
  - feature
  - ux
refs: []
by: developer
at: '2026-03-29T22:28:53.436Z'
---

## Background

Brain API now supports `sort` param with `title` and `modified` fields, each `asc` or `desc`. Adding sort controls to browse and search gives users control over how memories are ordered.

## Key Points

- [x] Add sort dropdown/toggle to browse page (next to status filters)
- [x] Add sort dropdown/toggle to search page
- [x] Options: Recent, Oldest, A-Z, Z-A
- [x] Persist sort choice in URL params for sharing/refresh
- [x] Default: recently modified (desc)
- [x] API format: sort=field:order (e.g. sort=title:asc)
