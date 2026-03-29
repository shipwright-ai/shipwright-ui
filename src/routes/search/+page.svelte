<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		searchMemories,
		type SearchResponse,
		type Facets,
		type SortField,
		type SortOrder
	} from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import MemoryCard from '$lib/components/MemoryCard.svelte';
	import { onMount } from 'svelte';

	let data = $state<SearchResponse | null>(null);
	let loading = $state(false);
	let searched = $state(false);
	let tagFacets = $state<Facets | null>(null);

	// Read from URL
	let query = $derived($page.url.searchParams.get('q') ?? '');
	let statusFilter = $derived($page.url.searchParams.get('status'));
	let activeTags = $derived.by(() => {
		// Support both ?tag=a&tag=b (multi-param) and ?tags=a,b (comma-separated)
		const multi = $page.url.searchParams.getAll('tag');
		if (multi.length > 0) return multi;
		const csv = $page.url.searchParams.get('tags');
		if (csv) return csv.split(',');
		return [];
	});

	let sortField = $derived(($page.url.searchParams.get('sort') as SortField) || 'modified');
	let sortOrder = $derived(($page.url.searchParams.get('order') as SortOrder) || 'desc');
	let inputValue = $state('');

	const SORT_OPTIONS: { label: string; field: SortField; order: SortOrder }[] = [
		{ label: 'Recent', field: 'modified', order: 'desc' },
		{ label: 'Oldest', field: 'modified', order: 'asc' },
		{ label: 'A–Z', field: 'title', order: 'asc' },
		{ label: 'Z–A', field: 'title', order: 'desc' }
	];

	onMount(() => {
		inputValue = query;
		if (query || activeTags.length > 0) {
			doSearch();
		}
	});

	$effect(() => {
		void query;
		void statusFilter;
		void activeTags;
		void sortField;
		void sortOrder;
		inputValue = query;
		doSearch();
	});

	async function doSearch() {
		if (!query && activeTags.length === 0) {
			data = null;
			searched = false;
			return;
		}
		loading = true;
		searched = true;
		try {
			// First fetch with query + tags only (for status tab counts)
			const baseOpts = {
				query: query || undefined,
				tags: activeTags.length > 0 ? activeTags : undefined,
				sort: sortField,
				order: sortOrder
			};
			const tagResult = await searchMemories(baseOpts);
			tagFacets = tagResult.facets ?? null;

			// If status active, fetch again with status
			if (statusFilter) {
				data = await searchMemories({
					...baseOpts,
					status: statusFilter as 'not-started' | 'in-progress' | 'done'
				});
			} else {
				data = tagResult;
			}
		} catch {
			data = null;
		} finally {
			loading = false;
		}
	}

	function updateUrl(
		q: string,
		status: string | null,
		tags: string[],
		sort?: SortField,
		order?: SortOrder
	) {
		const url = new URL($page.url);
		if (q) {
			url.searchParams.set('q', q);
		} else {
			url.searchParams.delete('q');
		}
		if (status) {
			url.searchParams.set('status', status);
		} else {
			url.searchParams.delete('status');
		}
		url.searchParams.delete('tag');
		url.searchParams.delete('tags');
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

	function setSort(field: SortField, order: SortOrder) {
		updateUrl(query, statusFilter, activeTags, field, order);
	}

	function submitSearch() {
		updateUrl(inputValue.trim(), statusFilter, activeTags);
	}

	function setStatus(status: string | null) {
		updateUrl(query, status, activeTags);
	}

	function toggleTag(tag: string) {
		const newTags = activeTags.includes(tag)
			? activeTags.filter((t) => t !== tag)
			: [...activeTags, tag];
		updateUrl(query, statusFilter, newTags);
	}

	function clearTags() {
		updateUrl(query, statusFilter, []);
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
	<h2 class="mb-4 text-xl font-semibold">search memories</h2>

	<!-- Search field -->
	<form
		onsubmit={(e) => {
			e.preventDefault();
			submitSearch();
		}}
		class="mb-4 flex gap-2"
	>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			type="text"
			bind:value={inputValue}
			placeholder="search..."
			autofocus
			class="flex-1 rounded border border-brain-border bg-brain-bg px-3 py-2 text-sm text-brain-text placeholder:text-brain-muted focus:border-brain-accent focus:outline-none"
		/>
		<button
			type="submit"
			class="rounded bg-brain-accent px-4 py-2 text-sm font-medium text-black hover:opacity-90"
		>
			search
		</button>
	</form>

	{#if searched}
		<!-- Tag filters -->
		{#if tagFacets && tagFacets.tags.length > 0}
			<div class="mb-3 flex flex-wrap items-center gap-1.5">
				<span class="text-xs text-brain-muted">tags:</span>
				{#each tagFacets.tags as tagFacet (tagFacet.tag)}
					{@const tagCategory = detectCategory([tagFacet.tag])}
					<button
						onclick={() => toggleTag(tagFacet.tag)}
						class="cursor-pointer rounded px-1.5 py-0.5 text-xs transition-colors {activeTags.includes(
							tagFacet.tag
						)
							? 'ring-2 ring-brain-accent ring-offset-1 ring-offset-brain-bg'
							: ''} {tagCategory
							? ''
							: activeTags.includes(tagFacet.tag)
								? 'text-brain-accent'
								: 'text-brain-muted hover:text-brain-text'}"
					>
						{#if tagCategory}
							<CategoryBadge category={tagCategory} />
							<span class="text-brain-muted">({tagFacet.count})</span>
						{:else}
							{tagFacet.tag} ({tagFacet.count})
						{/if}
					</button>
				{/each}
				{#if activeTags.length > 0}
					<button onclick={clearTags} class="text-xs text-brain-muted hover:text-brain-text">
						clear
					</button>
				{/if}
			</div>
		{/if}

		<!-- Status tabs -->
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

		<!-- Results -->
		{#if loading}
			<p class="text-brain-muted">searching...</p>
		{:else if !data || data.memories.length === 0}
			<div class="flex flex-col items-center py-12 text-center">
				<img src="/error-404.svg" alt="No results" class="mb-6 h-40 w-auto opacity-60" />
				<p class="text-lg font-medium text-brain-muted">No results found</p>
				<p class="mt-1 text-sm text-brain-muted/60">
					Try different keywords or broaden your search
				</p>
			</div>
		{:else}
			<div class="mb-3 flex items-center justify-between">
				<p class="text-xs text-brain-muted">{data.total} results</p>
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
			<div class="space-y-2">
				{#each data.memories as result (result.memory_file)}
					<MemoryCard memory={result} showKind showTags {activeTags} onToggleTag={toggleTag} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
