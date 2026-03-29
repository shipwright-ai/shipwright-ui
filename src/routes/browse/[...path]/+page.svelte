<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		browseKind,
		type BrowseKindResponse,
		type Facets,
		type SortField,
		type SortOrder
	} from '$lib/brain';
	import MemoryCard from '$lib/components/MemoryCard.svelte';
	import TagIcon from '$lib/components/TagIcon.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';

	let data = $state<BrowseKindResponse | null>(null);
	let error = $state<string | null>(null);
	let currentPath = $derived($page.params.path ?? '');

	// Facets from tag-only query (for status tab counts + tag list)
	let tagFacets = $state<Facets | null>(null);

	// Read filters from URL
	let statusFilter = $derived($page.url.searchParams.get('status'));
	let activeTags = $derived($page.url.searchParams.getAll('tag'));
	let sortField = $derived(($page.url.searchParams.get('sort') as SortField) || 'modified');
	let sortOrder = $derived(($page.url.searchParams.get('order') as SortOrder) || 'desc');

	onMount(() => load());

	$effect(() => {
		void currentPath;
		void statusFilter;
		void activeTags;
		void sortField;
		void sortOrder;
		load();
	});

	async function load() {
		if (!currentPath) return;
		error = null;
		try {
			// Fetch with tags only → status counts for tabs
			const sortOpts = { sort: sortField, order: sortOrder } as const;
			const tagOpts: { tags?: string[] } = {};
			if (activeTags.length > 0) tagOpts.tags = activeTags;
			const tagResult = await browseKind(currentPath, { ...tagOpts, ...sortOpts });
			tagFacets = tagResult.facets ?? null;

			// If status filter active, fetch again with both
			if (statusFilter) {
				data = await browseKind(currentPath, {
					...tagOpts,
					...sortOpts,
					status: statusFilter
				});
			} else {
				data = tagResult;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load';
		}
	}

	function updateUrl(status: string | null, tags: string[], sort?: SortField, order?: SortOrder) {
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
		const s = sort ?? sortField;
		const o = order ?? sortOrder;
		if (s !== 'modified' || o !== 'desc') {
			url.searchParams.set('sort', s);
			url.searchParams.set('order', o);
		} else {
			url.searchParams.delete('sort');
			url.searchParams.delete('order');
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

	function setSort(field: SortField, order: SortOrder) {
		updateUrl(statusFilter, activeTags, field, order);
	}

	const SORT_OPTIONS: { label: string; field: SortField; order: SortOrder }[] = [
		{ label: 'Recent', field: 'modified', order: 'desc' },
		{ label: 'Oldest', field: 'modified', order: 'asc' },
		{ label: 'A–Z', field: 'title', order: 'asc' },
		{ label: 'Z–A', field: 'title', order: 'desc' }
	];

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
		<div class="flex flex-col items-center py-12 text-center">
			<img src="/error-generic.svg" alt="Error" class="mb-6 h-40 w-auto opacity-80" />
			<p class="mb-2 text-lg font-medium text-brain-muted">Something went wrong</p>
			<p class="text-sm text-brain-muted/60">{error}</p>
		</div>
	{:else if !data}
		<Spinner />
	{:else}
		<h2 class="mb-4 text-xl font-semibold capitalize">{data.kind}</h2>

		<!-- Tag filters (first — narrow by topic, uses tag-only facets so always visible) -->
		{#if tagFacets && tagFacets.tags.length > 0}
			<div class="mb-3 flex flex-wrap items-center gap-1.5">
				<span class="text-xs text-brain-muted">tags:</span>
				{#each tagFacets.tags as tagFacet (tagFacet.tag)}
					<button
						onclick={() => toggleTag(tagFacet.tag)}
						class="cursor-pointer rounded px-1.5 py-0.5 text-xs transition-colors {activeTags.includes(
							tagFacet.tag
						)
							? 'text-brain-accent'
							: 'text-brain-muted hover:text-brain-text'}"
					>
						<span class="opacity-40"><TagIcon tag={tagFacet.tag} /></span>
						{tagFacet.tag} <span class="opacity-40">({tagFacet.count})</span>
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

		<div class="mb-4 flex items-center justify-between">
			<p class="text-xs text-brain-muted">{data.total} memories</p>
			<div class="flex gap-1">
				{#each SORT_OPTIONS as opt (opt.label)}
					<button
						onclick={() => setSort(opt.field, opt.order)}
						class="cursor-pointer rounded px-2 py-0.5 text-xs transition-colors {sortField ===
							opt.field && sortOrder === opt.order
							? 'bg-brain-accent/20 text-brain-accent'
							: 'text-brain-muted hover:text-brain-text'}"
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>

		{#if data.memories.length > 0}
			<div class="space-y-2">
				{#each data.memories as entry (entry.memory_file)}
					<MemoryCard memory={entry} showTags {activeTags} onToggleTag={toggleTag} />
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center py-12 text-center">
				<img src="/error-generic.svg" alt="No results" class="mb-6 h-40 w-auto opacity-60" />
				<p class="text-lg font-medium text-brain-muted">No memories match this filter</p>
				<p class="mt-1 text-sm text-brain-muted/60">Try a different status or clear tag filters</p>
			</div>
		{/if}
	{/if}
</div>
