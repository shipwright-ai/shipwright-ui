---
title: Brain UI Decisions
summary: >-
  Key technical decisions: client-side fetching, localStorage config, brain-*
  colors, Svelte 5 runes, marked for markdown
kind: decisions
tags:
  - brain-ui
  - decisions
  - technical
refs: []
by: developer
at: '2026-03-29T12:12:14.013Z'
---

# Decisions

## Client-side only data fetching

**Decision:** All Brain API calls happen client-side (onMount/$effect), no SSR.
**Context:** Brain runs on localhost — SSR would require the build server to also have Brain access.
**Why:** Keeps deployment simple. No server-side secrets or proxy config needed.
**Alternatives rejected:** SSR with server-side fetch, SvelteKit load functions.

## Brain URL in localStorage, not env vars

**Decision:** Brain URL is configurable at runtime via localStorage, with a settings UI in the header.
**Context:** Developers may run Brain on different ports or machines.
**Why:** Runtime config means no rebuild needed to point at a different Brain instance.
**Alternatives rejected:** Environment variables (require rebuild), hardcoded URL.

## Custom brain-\* color tokens

**Decision:** All UI colors use `brain-*` prefixed custom CSS properties defined in layout.css.
**Context:** shadcn-svelte uses zinc theme as base, but Brain UI needs its own dark identity.
**Why:** Centralized color definitions, easy to theme, consistent across all components.
**Alternatives rejected:** Using shadcn defaults directly, CSS-in-JS.

## Svelte 5 runes mode

**Decision:** Use Svelte 5 runes ($state, $derived, $effect, $props) throughout.
**Context:** Svelte 5 was the latest at project start.
**Why:** Runes are the future of Svelte — cleaner reactivity model, better TypeScript support.
**Alternatives rejected:** Svelte 4 stores, legacy reactive declarations.

## marked for markdown rendering

**Decision:** Use `marked` library with `{@html}` for rendering memory content.
**Context:** Brain stores memories as markdown files.
**Why:** Lightweight, fast, good enough for rendering trusted content from Brain.
**Alternatives rejected:** mdsvex (compile-time only), remark/rehype (heavier).

## No state management library

**Decision:** Use Svelte runes + local component state only.
**Context:** App is read-only with simple data flow.
**Why:** No shared mutable state across routes — each page fetches what it needs.
**Alternatives rejected:** Svelte stores, external state management.

## Dogfooding

**Decision:** Brain UI was built using Shipwright + Brain.
**Context:** This is the first real test of the Shipwright ecosystem.
**Why:** The product IS the test. Real usage surfaces real problems.
