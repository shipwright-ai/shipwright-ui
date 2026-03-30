---
title: Syntax highlighting for code blocks in memory content
summary: >-
  Add syntax highlighting to fenced code blocks in rendered markdown using shiki
  or highlight.js
kind: ideas
tags:
  - brain-ui
  - ux
  - styling
refs:
  - docs/examples/syntax-highlighting-demo/memory.md
by: developer
at: '2026-03-29T15:24:04.914Z'
---

# Syntax highlighting for code blocks in memory content

> Context: code blocks in memory markdown render as plain monospace text with no highlighting

- [x] Choose highlighting library: highlight.js (runtime, tree-shakeable)
- [x] Integrate with marked via marked-highlight plugin
- [x] Dark theme: github-dark-dimmed (matches brain-\* palette)
- [x] Languages: js, ts, python, bash, json, yaml, markdown, css, html, xml, svelte

![syntax-highlighting-working.png](syntax-highlighting-working.png)
