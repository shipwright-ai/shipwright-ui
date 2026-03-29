---
title: 'Non-image asset handling (STL, PDF, etc)'
summary: >-
  Test and support non-image attachments like STL files, PDFs — show download
  links instead of inline rendering
kind: ideas
tags:
  - brain-ui
  - feature
  - attachments
refs: []
by: developer
at: '2026-03-29T15:24:01.425Z'
---

# Non-image asset handling (STL, PDF, etc)

> Context: brain.attach_to_memory works with any file type, but brain-ui only handles images inline

- [x] Test attaching non-image files (STL, PDF, etc)
- [x] Show download link for non-image attachments (relative path rewriting works)
- [x] File type icons (emoji) based on extension: PDF, 3D, archive, spreadsheet, etc
- [x] Standalone file links render as attachment cards with icon, name, download button
- [x] PDF accordion: collapsible preview with inline iframe
- [x] Download button styled as button, not link
- [ ] Test PDF preview actually renders in browser

[testprint.stl](testprint.stl)

[testpdf.pdf](testpdf.pdf)
