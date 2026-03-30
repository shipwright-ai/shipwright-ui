---
title: Syntax highlighting demo
summary: >-
  Example memory showcasing code blocks with syntax highlighting across multiple
  languages
kind: examples
tags:
  - demo
refs:
  - docs/ideas/syntax-highlighting-for-code-blocks-in-memory-content/memory.md
by: developer
at: '2026-03-30T22:53:13.942Z'
---

## TypeScript

```typescript
interface Memory {
	title: string;
	tags: string[];
	progress?: { checked: number; total: number };
}

function extractPriority(tags: string[]): string | undefined {
	const levels = new Set(['low', 'medium', 'high', 'urgent', 'blocker']);
	return tags.find((t) => levels.has(t));
}

const memories: Memory[] = await fetch('/api/browse').then((r) => r.json());
const urgent = memories.filter((m) => extractPriority(m.tags) === 'urgent');
console.log(`Found ${urgent.length} urgent memories`);
```

## Python

```python
from dataclasses import dataclass
from pathlib import Path
import yaml

@dataclass
class Memory:
    title: str
    summary: str
    tags: list[str]
    kind: str

def load_memory(path: Path) -> Memory:
    """Load a memory from a markdown file with YAML frontmatter."""
    text = path.read_text()
    _, frontmatter, content = text.split("---", 2)
    meta = yaml.safe_load(frontmatter)
    return Memory(
        title=meta["title"],
        summary=meta.get("summary", ""),
        tags=meta.get("tags", []),
        kind=meta.get("kind", "unknown"),
    )

for path in Path("docs").rglob("memory.md"):
    mem = load_memory(path)
    if "dropped" in mem.tags:
        print(f"  DROPPED: {mem.title}")
```

## Svelte

```svelte
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { MemorySummary } from '$lib/brain';

	let { memory }: { memory: MemorySummary } = $props();
	const isDone = $derived(memory.progress?.status === 'done');
</script>

<a
	href={resolve('/memory/[...path]', { path: memory.memory_file })}
	class="block rounded border p-3 {isDone ? 'opacity-60' : ''}"
>
	<h3>{memory.title}</h3>
	<p class="text-sm text-brain-muted">{memory.summary}</p>
</a>
```

## Bash

```bash
#!/usr/bin/env bash
set -euo pipefail

# Find all memories tagged as "dropped"
grep -rl "dropped" docs/*/memory.md | while read -r file; do
  title=$(grep "^title:" "$file" | sed 's/title: //')
  echo "DROPPED: $title ($file)"
done

# Count memories by kind
echo "--- Memory counts ---"
for kind in docs/*/; do
  count=$(find "$kind" -name "memory.md" | wc -l)
  printf "%-20s %d\n" "$(basename "$kind")" "$count"
done
```

## JSON

```json
{
	"level": "kind",
	"kind": "ideas",
	"memories": [
		{
			"memory_file": "docs/ideas/resolution-badges/memory.md",
			"title": "Resolution badges for rejected/deferred/cancelled ideas",
			"tags": ["feature", "ui", "high"],
			"progress": { "checked": 3, "total": 6, "status": "in-progress" }
		}
	],
	"total": 42,
	"hasMore": false
}
```

## YAML

```yaml
title: Brain UI
stack:
  framework: SvelteKit 2
  language: TypeScript
  styling: Tailwind CSS 4
  components: shadcn-svelte
  font: JetBrains Mono

resolution_levels:
  - name: dropped
    icon: CircleOff
    color: zinc-500
  - name: deferred
    icon: Clock
    color: blue-400
  - name: rejected
    icon: XCircle
    color: red-400
```

## CSS

```css
@theme {
	--color-brain-bg: #0c0c0c;
	--color-brain-surface: #161616;
	--color-brain-border: #2a2a2a;
	--color-brain-text: #e4e4e7;
	--color-brain-muted: #71717a;
	--color-brain-accent: #3b82f6;
}

.prose pre {
	background-color: var(--color-brain-bg);
	border: 1px solid var(--color-brain-border);
	border-radius: 0.375rem;
	overflow-x: auto;
}
```
