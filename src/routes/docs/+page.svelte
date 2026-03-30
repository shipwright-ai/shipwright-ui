<script lang="ts">
	import {
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
	interface Param {
		name: string;
		type: string;
		required?: boolean;
		description: string;
		values?: string[];
	}

	interface Tool {
		name: string;
		description: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon: any;
		params: Param[];
	}

	const tools: Tool[] = [
		{
			name: 'browse_memories',
			description:
				'Browse the memory tree. Three levels: no path returns kinds with counts, a kind string returns memories in that kind, a memory_file returns sub-memories.',
			icon: FolderTree,
			params: [
				{
					name: 'path',
					type: 'string',
					description: 'Kind string (e.g. "ideas") or memory_file path. Omit for top-level kinds.'
				},
				{
					name: 'tags',
					type: 'string[]',
					description: 'Filter by tags — only show memories matching any of the given tags.'
				},
				{ name: 'limit', type: 'number', description: 'Max results per call. Default: 20.' },
				{
					name: 'offset',
					type: 'number',
					description: 'Skip N results for pagination. Default: 0.'
				}
			]
		},
		{
			name: 'search_memories',
			description:
				'Keyword search across title, summary, tags, kind, and slug. Matches if ANY query hits (OR logic). Returns max 20 results per call.',
			icon: Search,
			params: [
				{
					name: 'queries',
					type: 'string[]',
					required: true,
					description: 'Search queries, e.g. ["auth", "JWT", "login"]. Matches any.'
				},
				{
					name: 'status',
					type: 'enum',
					description: 'Filter by checkbox status.',
					values: ['not-started', 'in-progress', 'done']
				},
				{ name: 'kind', type: 'string', description: 'Filter by kind, e.g. "ideas".' },
				{ name: 'tags', type: 'string[]', description: 'Filter by tags (any match).' },
				{ name: 'limit', type: 'number', description: 'Max results. Default: 20.' },
				{ name: 'offset', type: 'number', description: 'Skip N results. Default: 0.' }
			]
		},
		{
			name: 'semantic_search',
			description:
				'Find memories by meaning using embeddings. Finds conceptually related memories even when exact words don\u2019t match. Results ranked by similarity score (0\u20131).',
			icon: Sparkles,
			params: [
				{
					name: 'query',
					type: 'string',
					required: true,
					description: 'Natural language query, e.g. "how do we handle authentication".'
				},
				{
					name: 'status',
					type: 'enum',
					description: 'Filter by status.',
					values: ['not-started', 'in-progress', 'done']
				},
				{ name: 'kind', type: 'string', description: 'Filter by kind.' },
				{ name: 'tags', type: 'string[]', description: 'Filter by tags (any match).' },
				{ name: 'limit', type: 'number', description: 'Max results. Default: 20.' },
				{ name: 'offset', type: 'number', description: 'Skip N results. Default: 0.' }
			]
		},
		{
			name: 'create_memory',
			description:
				'Create a new memory. Brain creates the folder and frontmatter \u2014 you write the content to the returned file path. Without parent: creates at docs/{kind}/{slug}/memory.md. With parent: nests inside the parent\u2019s folder.',
			icon: Plus,
			params: [
				{
					name: 'title',
					type: 'string',
					required: true,
					description: 'Short descriptive title.'
				},
				{
					name: 'summary',
					type: 'string',
					required: true,
					description: 'One sentence \u2014 what someone needs to know without reading the content.'
				},
				{
					name: 'by',
					type: 'string',
					required: true,
					description: 'Who created it.',
					values: ['developer', 'reviewer', 'researcher', 'orchestrator']
				},
				{
					name: 'kind',
					type: 'string',
					description:
						'Top-level folder. Any string works \u2014 new kind = new folder. Common: ideas, decisions, architecture, conventions, features, bugs, patterns, learnings.'
				},
				{
					name: 'parent',
					type: 'string',
					description: 'Parent memory_file to nest under. Omit for top-level.'
				},
				{
					name: 'tags',
					type: 'string[]',
					description: 'Tags for filtering. Reuse existing tags for consistency.'
				},
				{
					name: 'refs',
					type: 'string[]',
					description: 'Related memory_file paths.'
				},
				{
					name: 'confirm_create',
					type: 'boolean',
					description: 'Set to true to skip duplicate check and force creation.'
				}
			]
		},
		{
			name: 'delete_memory',
			description: 'Delete a memory, its attachments, and clean up back-references. Permanent.',
			icon: Trash2,
			params: [
				{
					name: 'memory_file',
					type: 'string',
					required: true,
					description: 'Memory file path to delete.'
				}
			]
		},
		{
			name: 'attach_to_memory',
			description:
				'Copy a file into a memory\u2019s folder and append a reference in the markdown. Images get ![name](file), other files get [name](file).',
			icon: Paperclip,
			params: [
				{
					name: 'file_path',
					type: 'string',
					required: true,
					description: 'Path to the file to attach.'
				},
				{
					name: 'memory_file',
					type: 'string',
					required: true,
					description: 'Target memory file path.'
				},
				{
					name: 'name',
					type: 'string',
					description: 'Rename the file. Defaults to original filename.'
				}
			]
		},
		{
			name: 'get_memory_graph',
			description:
				'Get the full reference graph. Nodes have memory_file, title, summary. Edges show refs between memories.',
			icon: GitFork,
			params: []
		},
		{
			name: 'recall_developer_profile',
			description:
				'Load the developer\u2019s communication profile. Runs whoami to detect the user. Returns preferences, communication patterns, and how to adapt style. First call creates the profile.',
			icon: UserCircle,
			params: []
		},
		{
			name: 'recall_agent_memory',
			description:
				'Load technical learnings from previous sessions. First call creates the memory file. Returns learnings and edit instructions.',
			icon: Bot,
			params: [
				{
					name: 'agent_name',
					type: 'string',
					required: true,
					description: 'Your agent name.',
					values: ['developer', 'reviewer', 'researcher', 'orchestrator']
				}
			]
		},
		{
			name: 'screenshot',
			description:
				'Capture a screenshot of a URL via Playwright. Can interact with the page before capture via CSS selector clicks. Optionally attach directly to a memory.',
			icon: Camera,
			params: [
				{
					name: 'url',
					type: 'string',
					required: true,
					description: 'URL to screenshot.'
				},
				{
					name: 'memory_file',
					type: 'string',
					description: 'Attach screenshot to this memory. Omit for temp file.'
				},
				{
					name: 'name',
					type: 'string',
					description: 'Filename without .png extension.'
				},
				{
					name: 'clicks',
					type: 'string[]',
					description:
						'CSS selectors to click in order before capturing. E.g. [".avatar", ".settings-menu"].'
				}
			]
		}
	];

	let expandedTool = $state<string | null>(null);

	function toggleTool(name: string) {
		expandedTool = expandedTool === name ? null : name;
	}

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
				<button
					class="w-full rounded border border-brain-border bg-brain-surface text-left transition-colors hover:border-brain-accent"
					onclick={() => toggleTool(tool.name)}
				>
					<div class="flex items-start gap-3 p-3">
						<tool.icon class="mt-0.5 h-5 w-5 shrink-0 text-brain-accent" />
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<code class="text-sm text-brain-accent">{tool.name}</code>
								{#if tool.params.length > 0}
									<span class="text-xs text-brain-muted/50"
										>{tool.params.length} param{tool.params.length > 1 ? 's' : ''}</span
									>
								{/if}
							</div>
							<div class="mt-0.5 text-xs text-brain-muted">{tool.description}</div>
						</div>
						{#if tool.params.length > 0}
							<span class="mt-1 text-xs text-brain-muted/40"
								>{expandedTool === tool.name ? '\u25B2' : '\u25BC'}</span
							>
						{/if}
					</div>
				</button>
				{#if expandedTool === tool.name && tool.params.length > 0}
					<div class="ml-8 rounded border border-brain-border/50 bg-brain-bg p-3">
						<div class="space-y-2">
							{#each tool.params as param (param.name)}
								<div class="flex items-start gap-2">
									<div class="flex shrink-0 items-center gap-1.5">
										<code class="text-xs text-brain-text">{param.name}</code>
										<span class="rounded bg-brain-surface px-1 py-0.5 text-[10px] text-brain-muted"
											>{param.type}</span
										>
										{#if param.required}
											<span class="text-[10px] font-medium text-brain-red">required</span>
										{/if}
									</div>
									<span class="text-xs text-brain-muted">{param.description}</span>
								</div>
								{#if param.values}
									<div class="ml-4 flex flex-wrap gap-1">
										{#each param.values as val (val)}
											<code
												class="rounded bg-brain-surface px-1.5 py-0.5 text-[10px] text-brain-accent"
												>{val}</code
											>
										{/each}
									</div>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
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
