<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browseKind, type BrowseKindResponse, type Facets } from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import { onMount } from 'svelte';

	let data = $state<BrowseKindResponse | null>(null);
	let error = $state<string | null>(null);
	let currentPath = $derived($page.params.path ?? '');

	// Facets from tag-only query (for status tab counts + tag list)
	let tagFacets = $state<Facets | null>(null);

	// Read filters from URL
	let statusFilter = $derived($page.url.searchParams.get('status'));
	let activeTags = $derived($page.url.searchParams.getAll('tag'));

	onMount(() => load());

	$effect(() => {
		void currentPath;
		void statusFilter;
		void activeTags;
		load();
	});

	async function load() {
		if (!currentPath) return;
		error = null;
		try {
			// Fetch with tags only → status counts for tabs
			const tagOpts: { tags?: string[] } = {};
			if (activeTags.length > 0) tagOpts.tags = activeTags;
			const tagResult = await browseKind(currentPath, tagOpts);
			tagFacets = tagResult.facets ?? null;

			// If status filter active, fetch again with both
			if (statusFilter) {
				data = await browseKind(currentPath, { ...tagOpts, status: statusFilter });
			} else {
				data = tagResult;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load';
		}
	}

	function updateUrl(status: string | null, tags: string[]) {
		const url = new URL($page.url);
		if (status) {
			url.searchParams.set('status', status);
		} else {
			url.searchParams.delete('status');
		}
		url.searchParams.delete('tag');
		for (const t of tags) {
			url.searchParams.append('tag', t);
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- URL built from current page
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	function setStatus(status: string | null) {
		updateUrl(status, activeTags);
	}

	function toggleTag(tag: string) {
		const newTags = activeTags.includes(tag)
			? activeTags.filter((t) => t !== tag)
			: [...activeTags, tag];
		updateUrl(statusFilter, newTags);
	}

	function clearTags() {
		updateUrl(statusFilter, []);
	}

	let hasProgress = $derived(
		tagFacets
			? tagFacets.status['not-started'] > 0 ||
					tagFacets.status['in-progress'] > 0 ||
					tagFacets.status['done'] > 0
			: false
	);
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

		<!-- Tag filters (first — narrow by topic, uses tag-only facets so always visible) -->
		{#if tagFacets && tagFacets.tags.length > 0}
			<div class="mb-3 flex flex-wrap items-center gap-1.5">
				<span class="text-xs text-brain-muted">tags:</span>
				{#each tagFacets.tags as tagFacet (tagFacet.tag)}
					<button
						onclick={() => toggleTag(tagFacet.tag)}
						class="rounded px-1.5 py-0.5 text-xs transition-colors {activeTags.includes(
							tagFacet.tag
						)
							? 'border border-brain-accent bg-brain-accent/20 text-brain-accent'
							: 'border border-transparent bg-brain-bg text-brain-muted hover:text-brain-text'}"
					>
						{tagFacet.tag} ({tagFacet.count})
					</button>
				{/each}
				{#if activeTags.length > 0}
					<button onclick={clearTags} class="text-xs text-brain-muted hover:text-brain-text">
						clear
					</button>
				{/if}
			</div>
		{/if}

		<!-- Status tabs (always show all with counts from tag-filtered set) -->
		{#if hasProgress && tagFacets}
			<div class="mb-4 flex items-center gap-1 border-b border-brain-border">
				<button
					onclick={() => setStatus(null)}
					class="border-b-2 px-3 py-2 text-xs transition-colors {statusFilter === null
						? 'border-brain-accent text-brain-text'
						: 'border-transparent text-brain-muted hover:text-brain-text'}"
				>
					All ({tagFacets.status['not-started'] +
						tagFacets.status['in-progress'] +
						tagFacets.status['done'] +
						tagFacets.status['no-progress']})
				</button>
				<button
					onclick={() => setStatus(statusFilter === 'not-started' ? null : 'not-started')}
					class="border-b-2 px-3 py-2 text-xs transition-colors {statusFilter === 'not-started'
						? 'border-brain-muted text-brain-text'
						: 'border-transparent text-brain-muted hover:text-brain-text'}"
				>
					Planned ({tagFacets.status['not-started']})
				</button>
				<button
					onclick={() => setStatus(statusFilter === 'in-progress' ? null : 'in-progress')}
					class="border-b-2 px-3 py-2 text-xs transition-colors {statusFilter === 'in-progress'
						? 'border-amber-500 text-amber-400'
						: 'border-transparent text-brain-muted hover:text-brain-text'}"
				>
					In Progress ({tagFacets.status['in-progress']})
				</button>
				<button
					onclick={() => setStatus(statusFilter === 'done' ? null : 'done')}
					class="border-b-2 px-3 py-2 text-xs transition-colors {statusFilter === 'done'
						? 'border-brain-green text-brain-green'
						: 'border-transparent text-brain-muted hover:text-brain-text'}"
				>
					Done ({tagFacets.status['done']})
				</button>
			</div>
		{/if}

		<p class="mb-4 text-xs text-brain-muted">{data.total} memories</p>

		{#if data.memories.length > 0}
			<div class="space-y-2">
				{#each data.memories as entry (entry.memory_file)}
					{@const category = detectCategory(entry.tags)}
					<a
						href={resolve('/memory/[...path]', { path: entry.memory_file })}
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
