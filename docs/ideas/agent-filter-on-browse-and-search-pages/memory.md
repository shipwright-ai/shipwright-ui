---
title: Agent filter on browse and search pages
summary: >-
  Added agent filter to browse and search pages — facet-driven, shows when Brain
  API returns agent data, follows same pattern as tags filter
kind: ideas
tags:
  - brain-ui
  - feature
  - filters
refs: []
by: developer
at: '2026-03-30T20:53:49.456Z'
---

## Background

Brain memories can be assigned to agents. The API already supports an `agent` query param on browse and search endpoints, and returns `agents` facets with counts. The UI needed a filter to expose this.

## Implementation

- [x] Add `agent` param to `browseKind()` and `searchMemories()` in `brain.ts`
- [x] Add `AgentFacet` type and `agents` field to `Facets` interface
- [x] Add agent filter row to browse page (between tags and status tabs)
- [x] Add agent filter row to search page (same placement)
- [x] URL param: `?agent=name` (single-select, toggle on/off)
- [x] `make check` passes

## Details

- Facet-driven: filter row only appears when API returns agents
- Single-select (unlike tags which are multi-select) — click toggles, click again deselects
- "clear" button shown when an agent is active
- Follows same styling as tag filter buttons (accent when active, muted when inactive)
- Committed as `16ac63c`
