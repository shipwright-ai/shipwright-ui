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

- [ ] Add global keydown listener for Cmd+K / Ctrl+K
- [ ] Create modal overlay component with search input
- [ ] Debounce input and call searchMemories on each keystroke
- [ ] Show results as a dropdown list with kind badges and progress
- [ ] Navigate results with arrow keys, Enter to open
- [ ] Esc to close, click outside to dismiss
