---
title: API pagination with tag/status facets
summary: >-
  Browse and search APIs need proper pagination and return aggregated tag/status
  facets on first page for UI filters
kind: ideas
tags:
  - brain
  - api
  - feature
refs:
  - >-
    docs/ideas/browse-filters-status-type-icons-and-visual-improvements/memory.md
by: developer
at: '2026-03-29T14:11:19.748Z'
---

# API pagination with tag/status facets

> Context: brain-ui loads all memories client-side and filters in JS — won't scale. Brain API should own pagination and facets.

## Pagination

- [ ] browse endpoint: respect limit/offset, return total + hasMore
- [ ] search endpoint: same pagination pattern
- [ ] Response shape: `{ total, limit, offset, hasMore, memories: [...] }`

## Facets (first page only, when offset=0)

- [ ] Return aggregated tags with counts: `facets.tags: [{ tag, count }]`
- [ ] Return status distribution: `facets.status: { not-started, in-progress, done, no-progress }`
- [ ] Facets respect active filters — if `?tags=bug`, facets show counts for that subset
- [ ] Same pattern for /api/search

## Why

- Client-side filtering doesn't scale past ~50 memories
- UI needs facet counts to render filters (cascading: only show possible combinations)
- Removes need for brain-ui to fetch everything upfront

## Prompt for Brain Claude

Brain API: Add pagination metadata with tag/status facets

The browse endpoint needs:

1. Proper pagination — limit/offset with total count
2. Facets on first page (offset=0) — aggregated tags with counts + status distribution
3. Facets respect current filters for cascading UI filters
4. Same pattern for /api/search

Response shape:

```json
{
  "level": "kind",
  "kind": "ideas",
  "memories": [...],
  "total": 47,
  "limit": 20,
  "offset": 0,
  "hasMore": true,
  "facets": {
    "tags": [{ "tag": "brain-ui", "count": 12 }, { "tag": "bug", "count": 3 }],
    "status": { "not-started": 5, "in-progress": 3, "done": 4, "no-progress": 35 }
  }
}
```
