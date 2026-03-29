<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { browseKind, type BrowseKindResponse, type MemorySummary } from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import { onMount } from 'svelte';

	let data = $state<BrowseKindResponse | null>(null);
	let error = $state<string | null>(null);
	let statusFilter = $state<string | null>(null);
	let activeTags = $state<string[]>([]);
	let currentPath = $derived($page.params.path ?? '');

	// Items after status filter (before tag filter) — used to compute available tags
	let statusFiltered = $derived.by(() => {
		if (!data) return [];
		if (!statusFilter) return data.memories;
		return data.memories.filter((m: MemorySummary) => {
			if (!m.progress) return statusFilter === 'no-progress';
			return m.progress.status === statusFilter;
		});
	});

	// Tags available given current status + active tag filters (cascading)
	let availableTags = $derived.by(() => {
		const pool =
			activeTags.length > 0
				? statusFiltered.filter((m: MemorySummary) => activeTags.every((t) => m.tags.includes(t)))
				: statusFiltered;
		const tags: string[] = [];
		for (const m of pool) {
			for (const t of m.tags) {
				if (!tags.includes(t)) tags.push(t);
			}
		}
		return tags.sort();
	});

	let filtered = $derived.by(() => {
		if (activeTags.length > 0) {
			return statusFiltered.filter((m: MemorySummary) =>
				activeTags.every((t) => m.tags.includes(t))
			);
		}
		return statusFiltered;
	});

	let hasProgress = $derived(data?.memories.some((m: MemorySummary) => m.progress) ?? false);

	function toggleTag(tag: string) {
		if (activeTags.includes(tag)) {
			activeTags = activeTags.filter((t) => t !== tag);
		} else {
			activeTags = [...activeTags, tag];
		}
	}

	onMount(() => load());

	$effect(() => {
		void currentPath;
		load();
	});

	async function load() {
		data = null;
		error = null;
		statusFilter = null;
		activeTags = [];
		try {
			data = await browseKind(currentPath);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load';
		}
	}
</script>

<div class="mx-auto max-w-4xl">
	<!-- Breadcrumbs -->
	<nav class="mb-6 flex items-center gap-1.5 text-sm text-brain-muted">
		<a href={resolve('/')} class="hover:text-brain-text">home</a>
		<span>/</span>
		<span class="text-brain-text">{currentPath}</span>
	</nav>

	{#if error}
		<div class="rounded border border-brain-red/30 bg-brain-red/10 p-4 text-sm text-brain-red">
			{error}
		</div>
	{:else if !data}
		<p class="text-brain-muted">loading...</p>
	{:else}
		<h2 class="mb-4 text-xl font-semibold capitalize">{data.kind}</h2>

		<!-- Status filter bar -->
		{#if hasProgress}
			<div class="mb-4 flex items-center gap-2">
				<button
					onclick={() => (statusFilter = null)}
					class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === null
						? 'bg-brain-accent text-black'
						: 'text-brain-muted hover:text-brain-text'}"
				>
					All ({data.total})
				</button>
				<button
					onclick={() => (statusFilter = 'not-started')}
					class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === 'not-started'
						? 'bg-brain-muted/30 text-brain-text'
						: 'text-brain-muted hover:text-brain-text'}"
				>
					Planned
				</button>
				<button
					onclick={() => (statusFilter = 'in-progress')}
					class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === 'in-progress'
						? 'bg-amber-500/20 text-amber-400'
						: 'text-brain-muted hover:text-brain-text'}"
				>
					In Progress
				</button>
				<button
					onclick={() => (statusFilter = 'done')}
					class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === 'done'
						? 'bg-brain-green/20 text-brain-green'
						: 'text-brain-muted hover:text-brain-text'}"
				>
					Done
				</button>
			</div>
		{/if}

		<!-- Tag filters -->
		{#if availableTags.length > 0}
			<div class="mb-4 flex flex-wrap items-center gap-1.5">
				<span class="text-xs text-brain-muted">tags:</span>
				{#each availableTags as tag (tag)}
					<button
						onclick={() => toggleTag(tag)}
						class="rounded px-1.5 py-0.5 text-xs transition-colors {activeTags.includes(tag)
							? 'border border-brain-accent bg-brain-accent/20 text-brain-accent'
							: 'border border-transparent bg-brain-bg text-brain-muted hover:text-brain-text'}"
					>
						{tag}
					</button>
				{/each}
				{#if activeTags.length > 0}
					<button
						onclick={() => (activeTags = [])}
						class="text-xs text-brain-muted hover:text-brain-text"
					>
						clear
					</button>
				{/if}
			</div>
		{/if}

		<p class="mb-4 text-xs text-brain-muted">{filtered.length} memories</p>

		{#if filtered.length > 0}
			<div class="space-y-2">
				{#each filtered as entry (entry.memory_file)}
					{@const category = detectCategory(entry.tags)}
					<a
						href={resolve('/memory/[file]', { file: encodeURIComponent(entry.memory_file) })}
						class="block rounded border p-3 transition-colors hover:border-brain-accent {entry
							.progress?.status === 'done'
							? 'border-brain-border/50 bg-brain-surface/50 opacity-60'
							: entry.progress?.status === 'in-progress'
								? 'border-l-2 border-t-brain-border border-r-brain-border border-b-brain-border border-l-amber-500 bg-brain-surface'
								: 'border-brain-border bg-brain-surface'}"
					>
						<div class="flex items-center gap-2 text-sm font-medium">
							{#if category}
								<CategoryBadge {category} />
							{/if}
							{entry.title}
							{#if entry.progress}
								<ProgressBadge progress={entry.progress} />
							{/if}
						</div>
						{#if entry.summary}
							<div class="mt-1 text-xs text-brain-muted">{entry.summary}</div>
						{/if}
						{#if entry.tags.length > 0}
							<div class="mt-2 flex gap-1.5">
								{#each entry.tags as tag (tag)}
									<button
										onclick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											toggleTag(tag);
										}}
										class="rounded px-1.5 py-0.5 text-xs transition-colors {activeTags.includes(tag)
											? 'bg-brain-accent/20 text-brain-accent'
											: 'bg-brain-bg text-brain-muted hover:text-brain-accent'}">{tag}</button
									>
								{/each}
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{:else}
			<p class="text-brain-muted">no memories match this filter</p>
		{/if}
	{/if}
</div>
