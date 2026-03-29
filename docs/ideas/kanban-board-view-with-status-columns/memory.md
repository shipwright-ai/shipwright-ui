---
title: Kanban board view with status columns
summary: >-
  Add a kanban board view showing all memories with progress in three columns:
  Planned, In Progress, Done — with tag/kind filters
kind: ideas
tags:
  - brain-ui
  - feature
  - ux
refs: []
by: developer
at: '2026-03-29T22:02:31.620Z'
---

## Background

All memories with checkboxes have a status (planned/in-progress/done). A kanban board view would give a project management overview — see what's planned, what's being worked on, and what's complete at a glance.

## Key Points

- [x] New route `/board`
- [x] Three columns: Not Started, In Progress, Done
- [x] Each column shows MemoryCard components with kind badge
- [x] Filter by tags with TagIcon
- [x] Fetch all memories with status using search API + sort=modified:desc
- [x] Responsive — stacks on mobile (grid-cols-1 md:grid-cols-3)

![kanban-board.png](kanban-board.png)
