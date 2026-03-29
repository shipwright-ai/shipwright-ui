---
title: Clickable images with lightbox/fullscreen view
summary: >-
  Images in memory detail should be clickable to view full size in a lightbox
  overlay
kind: ideas
tags:
  - brain-ui
  - ux
  - images
refs: []
by: developer
at: '2026-03-29T16:26:28.831Z'
---

# Clickable images with lightbox/fullscreen view

> Context: images render at 50% max-width — need to click to see full size, especially screenshots

- [x] Wrap images in clickable link with data-lightbox attribute
- [x] Show fullscreen overlay/lightbox on click (Svelte $state driven)
- [x] Esc (global svelte:window handler) or click outside to close
- [x] No library — pure CSS overlay with event delegation on article
- [x] PDF lightbox with fullscreen iframe preview

![lightbox-open.png](lightbox-open.png)
