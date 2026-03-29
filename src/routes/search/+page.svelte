<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { searchMemories, type SearchResponse, type Facets } from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
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

	let inputValue = $state('');

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
			const tagResult = await searchMemories({
				query: query || undefined,
				tags: activeTags.length > 0 ? activeTags : undefined
			});
			tagFacets = tagResult.facets ?? null;

			// If status active, fetch again with status
			if (statusFilter) {
				data = await searchMemories({
					query: query || undefined,
					tags: activeTags.length > 0 ? activeTags : undefined,
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

	function updateUrl(q: string, status: string | null, tags: string[]) {
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
		for (const t of tags) {
			url.searchParams.append('tag', t);
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- URL built from current page
		goto(url.toString(), { replaceState: true, noScroll: true });
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
		<input
			type="text"
			bind:value={inputValue}
			placeholder="search..."
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
			<p class="text-brain-muted">no results found</p>
		{:else}
			<p class="mb-3 text-xs text-brain-muted">{data.total} results</p>
			<div class="space-y-2">
				{#each data.memories as result (result.memory_file)}
					{@const category = detectCategory(result.tags)}
					<a
						href={resolve('/memory/[...path]', { path: result.memory_file })}
						class="block rounded border p-3 transition-colors hover:border-brain-accent {result
							.progress?.status === 'done'
							? 'border-brain-border/50 bg-brain-surface/50 opacity-60'
							: result.progress?.status === 'in-progress'
								? 'border-l-2 border-t-brain-border border-r-brain-border border-b-brain-border border-l-amber-500 bg-brain-surface'
								: 'border-brain-border bg-brain-surface'}"
					>
						<div class="flex items-center gap-2">
							<span class="rounded bg-brain-bg px-1.5 py-0.5 text-xs text-brain-accent"
								>{result.kind}</span
							>
							{#if category}
								<CategoryBadge {category} />
							{/if}
							<span class="text-sm font-medium">{result.title}</span>
							{#if result.progress}
								<ProgressBadge progress={result.progress} />
							{/if}
						</div>
						{#if result.summary}
							<div class="mt-1 text-xs text-brain-muted">{result.summary}</div>
						{/if}
						{#if result.tags.length > 0}
							<div class="mt-2 flex gap-1.5">
								{#each result.tags as tag (tag)}
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
		{/if}
	{/if}
</div>
