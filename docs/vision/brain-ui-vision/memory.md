---
title: Brain UI Vision
summary: >-
  SvelteKit frontend for browsing, searching, and reading Shipwright Brain
  memories — ships bundled with npx shipwright init
kind: vision
tags:
  - brain-ui
  - vision
  - product
refs:
  - docs/vision/brain-ui/memory.md
by: developer
at: '2026-03-29T12:12:13.968Z'
---

# Brain UI Vision

Brain UI is a lightweight web frontend for Shipwright Brain — it lets developers browse, search, and read the memories stored in their project's knowledge base.

## Who it's for

- **Developers using Shipwright** who want to see what's in Brain without using the CLI
- **Anyone debugging Brain** — see what's stored, what's connected, what's missing

## What success looks like

- Developer opens Brain UI, immediately sees all memory kinds and can drill down
- Search finds relevant memories fast
- Memory detail renders rich markdown with images, tags, and linked refs
- Eventually: graph view showing how memories connect (not MVP)

## Not in scope (yet)

- Creating or editing memories from the UI
- Authentication
- Multi-user / deployment beyond localhost
