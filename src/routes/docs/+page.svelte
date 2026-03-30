<script lang="ts">
	import {
		BrainCircuit,
		Search,
		FolderTree,
		Sparkles,
		Plus,
		Trash2,
		Paperclip,
		GitFork,
		UserCircle,
		Bot,
		Camera
	} from 'lucide-svelte';

	interface Tool {
		name: string;
		description: string;
		icon: typeof BrainCircuit;
	}

	const tools: Tool[] = [
		{
			name: 'browse_memories',
			description:
				'Browse the memory tree by kind, path, or memory file. Filter by tags and status. Returns up to 20 results per call.',
			icon: FolderTree
		},
		{
			name: 'search_memories',
			description:
				'Keyword search across title, summary, tags, kind, and slug. Filter by status (not-started, in-progress, done) and tags.',
			icon: Search
		},
		{
			name: 'semantic_search',
			description:
				'Find memories by meaning using embeddings. Finds conceptually related memories even when exact words don\u2019t match.',
			icon: Sparkles
		},
		{
			name: 'create_memory',
			description:
				'Create a new memory with title, summary, kind, and tags. Brain creates the folder and frontmatter \u2014 you write the content.',
			icon: Plus
		},
		{
			name: 'delete_memory',
			description: 'Delete a memory, its attachments, and clean up back-references. Permanent.',
			icon: Trash2
		},
		{
			name: 'attach_to_memory',
			description:
				'Copy a file into a memory\u2019s folder and append a reference. Images get ![name](file), other files get [name](file).',
			icon: Paperclip
		},
		{
			name: 'get_memory_graph',
			description:
				'Get the full reference graph. Nodes have memory_file, title, summary. Edges show refs between memories.',
			icon: GitFork
		},
		{
			name: 'recall_developer_profile',
			description:
				'Load the developer\u2019s communication profile. Detects the user via whoami. Returns preferences and how to adapt style.',
			icon: UserCircle
		},
		{
			name: 'recall_agent_memory',
			description:
				'Load technical learnings from previous sessions. First call creates the memory file. Returns learnings and edit instructions.',
			icon: Bot
		},
		{
			name: 'screenshot',
			description:
				'Capture a screenshot of a URL via Playwright. Optionally click elements before capture. Can attach directly to a memory.',
			icon: Camera
		}
	];

	interface Concept {
		term: string;
		definition: string;
	}

	const concepts: Concept[] = [
		{
			term: 'Memory',
			definition:
				'A markdown file with YAML frontmatter (title, summary, tags, refs). The atomic unit of knowledge in Brain.'
		},
		{
			term: 'Kind',
			definition:
				'Top-level folder that groups memories: ideas, decisions, architecture, conventions, features, etc.'
		},
		{
			term: 'Tags',
			definition:
				'Labels for filtering. Reuse existing tags for consistency. Any memory can have multiple tags.'
		},
		{
			term: 'Refs',
			definition:
				'References between memories. Creates a knowledge graph. Brain auto-suggests related memories on create.'
		},
		{
			term: 'Progress',
			definition:
				'Auto-detected from checkboxes: 0/N = not-started, some/N = in-progress, N/N = done. No extra fields needed.'
		},
		{
			term: 'Sub-memory',
			definition:
				'A memory nested inside another memory\u2019s folder. Created by passing a parent parameter.'
		},
		{
			term: 'Facets',
			definition:
				'Aggregated counts returned with browse results: tag counts and status breakdown (planned, in-progress, done).'
		}
	];

	interface WorkflowStep {
		step: string;
		description: string;
	}

	const workflow: WorkflowStep[] = [
		{
			step: 'Capture',
			description:
				'Create a Brain idea with checklist steps. Break work into 3\u20136 concrete checkboxes.'
		},
		{
			step: 'Refine',
			description:
				'Discuss the plan with the developer. Add, remove, reorder steps. Keep going until they approve.'
		},
		{
			step: 'Implement',
			description:
				'Only start coding after approval. Check off boxes as you go. Update the idea with scope changes and decisions.'
		},
		{
			step: 'Verify',
			description:
				'Run make check, self-review against conventions, attach screenshots, commit after each completed idea.'
		}
	];
</script>

<div class="mx-auto max-w-4xl py-8">
	<div class="mb-8">
		<h1 class="text-2xl font-semibold">Documentation</h1>
		<p class="mt-1 text-brain-muted">Brain MCP tools, concepts, and Shipwright workflow</p>
	</div>

	<!-- Concepts -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold">Concepts</h2>
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each concepts as concept (concept.term)}
				<div class="rounded border border-brain-border bg-brain-surface p-3">
					<div class="text-sm font-semibold text-brain-accent">{concept.term}</div>
					<div class="mt-1 text-xs text-brain-muted">{concept.definition}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- MCP Tools -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold">MCP Tools</h2>
		<div class="space-y-2">
			{#each tools as tool (tool.name)}
				<div class="flex items-start gap-3 rounded border border-brain-border bg-brain-surface p-3">
					<tool.icon class="mt-0.5 h-5 w-5 shrink-0 text-brain-accent" />
					<div>
						<div class="text-sm font-medium">
							<code class="text-brain-accent">{tool.name}</code>
						</div>
						<div class="mt-0.5 text-xs text-brain-muted">{tool.description}</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Shipwright Workflow -->
	<section class="mb-10">
		<h2 class="mb-4 text-lg font-semibold">Shipwright Workflow</h2>
		<div class="space-y-2">
			{#each workflow as item, i (item.step)}
				<div class="flex items-start gap-3 rounded border border-brain-border bg-brain-surface p-3">
					<span
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brain-accent/10 text-xs font-semibold text-brain-accent"
					>
						{i + 1}
					</span>
					<div>
						<div class="text-sm font-semibold">{item.step}</div>
						<div class="mt-0.5 text-xs text-brain-muted">{item.description}</div>
					</div>
				</div>
			{/each}
		</div>
	</section>
</div>
