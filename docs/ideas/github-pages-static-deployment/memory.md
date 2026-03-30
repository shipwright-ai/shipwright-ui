---
title: GitHub Pages static deployment
summary: >-
  Deploy Brain UI as a static site on GitHub Pages — dropped because vector
  search cannot run client-side
kind: ideas
tags:
  - feature
  - deployment
  - dropped
refs: []
by: developer
at: '2026-03-30T22:42:54.120Z'
---

## Background

> Why: Brain UI currently requires a running Brain API server. For sharing docs publicly or within a team, a static GitHub Pages deployment would remove the need for hosting infrastructure.
> What: Convert Brain UI to a fully static site that can be deployed on GitHub Pages.
> Who: Anyone who wants to browse project docs without running Brain locally.

## Decision: Dropped

Brain's search uses **vector/semantic search** — a core part of the workflow. There is no viable way to replicate this client-side on a static site:

- Fuse.js only does keyword/fuzzy matching — no semantic understanding
- Pre-computed embeddings + client-side cosine similarity is impractical (large index, no way to embed queries in-browser)
- Dropping search entirely makes the UI significantly less useful

**Conclusion:** GitHub Pages static deployment is not feasible without compromising the search experience. Brain UI needs a live Brain API backend.

## Alternatives considered

1. **Fuse.js fuzzy search** — keyword only, no semantic understanding
2. **Pre-computed embeddings in browser** — impractical, large payload, no query embedding
3. **Browse + filters only, no search** — too degraded
4. **Hybrid (static pages + hosted search API)** — defeats the purpose of "just GitHub Pages"
