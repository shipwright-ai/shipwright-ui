---
title: Always attach screenshots to Brain ideas after UI changes
summary: >-
  After implementing any UI change, Claude must take a screenshot and attach it
  to the related Brain idea for visual history
kind: decisions
tags:
  - brain-ui
  - workflow
refs: []
by: developer
at: '2026-03-29T22:13:26.643Z'
---

## Decision

After implementing any UI change, Claude must:

1. Take a screenshot of the affected area using `brain.screenshot`
2. Attach it to the related Brain idea using `brain.attach_to_memory`
3. Capture "before" state too when possible

## Why

- Visual history of what the UI looked like at each stage
- Makes it easy to review changes without running the app
- Ideas become self-documenting with screenshots showing the result
- Helps future sessions understand the current state

## How to apply

- After every UI implementation, before reporting done
- Use `mcp__brain__screenshot` with the relevant URL
- Attach to the idea/bug memory that drove the change
- Include both the feature and any related empty/error states
