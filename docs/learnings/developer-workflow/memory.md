---
title: Developer workflow and communication style
summary: bartas sends multi-message streams, ships fast, needs Claude to read context before acting
kind: learnings
tags: [developer-profile, workflow]
by: developer
at: 2026-03-29T00:00:00.000Z
---

# Developer Workflow

## Communication style
- Sends multiple short messages as a stream of thought — each message isn't a complete instruction
- Don't treat each message as a standalone task — accumulate context before acting
- Prefers concise responses, no fluff

## Work patterns
- Ships fast, iterates quickly
- Sometimes needs to slow down for research, POC, or syncing with other features
- Unfinished work is a pain point — hard to pick up after a break
- When pausing a task, capture state clearly so it's easy to resume

## What wastes time
- Claude acting on half context, then needing course corrections
- Going back and forth when the answer was already in existing docs/code
- Claude asking questions that could be answered by reading Brain memories or project files

## What helps
- Read Brain memories, CLAUDE.md gates, and relevant docs BEFORE starting work
- Use Brain to store decisions so context survives between sessions
- Idea capture when jumping between tasks
