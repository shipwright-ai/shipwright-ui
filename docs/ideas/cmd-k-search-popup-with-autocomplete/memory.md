---
title: Cmd+K search popup with autocomplete
summary: >-
  Add keyboard-driven search popup (Cmd+K) with instant autocomplete results
  from Brain API
kind: ideas
tags:
  - brain-ui
  - search
  - ux
refs:
  - docs/architecture/brain-ui-architecture/memory.md
by: developer
at: '2026-03-29T12:54:39.607Z'
---

# Cmd+K search popup with autocomplete

> Context: browsing Brain UI, want fast keyboard-driven search like VS Code / Linear

- [x] Add global keydown listener for Cmd+K / Ctrl+K (svelte:window)
- [x] Create CommandPalette.svelte modal overlay with search input
- [x] Debounce input (200ms) and call searchMemories on each keystroke
- [x] Show results with kind badge, category badge, progress badge
- [x] Navigate results with arrow keys, Enter to open, mouse hover
- [x] Esc to close, click outside to dismiss

![cmd-k-palette.png](cmd-k-palette.png)
