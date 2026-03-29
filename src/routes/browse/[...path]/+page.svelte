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
	let facets = $state<Facets | null>(null);

	// Read filters from URL
	let statusFilter = $derived($page.url.searchParams.get('status'));
	let activeTags = $derived($page.url.searchParams.getAll('tag'));

	onMount(() => load());

	// Re-fetch when URL changes (path or query params)
	$effect(() => {
		void currentPath;
		void statusFilter;
		void activeTags;
		load();
	});

	async function load() {
		if (!currentPath) return;
		data = null;
		error = null;
		try {
			const opts: { tags?: string[]; status?: string } = {};
			if (activeTags.length > 0) opts.tags = activeTags;
			if (statusFilter) opts.status = statusFilter;
			data = await browseKind(currentPath, opts);
			facets = data.facets ?? null;
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
		facets ? Object.values(facets.status).some((v, i) => i < 3 && v > 0) : false
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

		<!-- Status filter bar -->
		{#if facets && hasProgress}
			<div class="mb-4 flex items-center gap-2">
				<button
					onclick={() => setStatus(null)}
					class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === null
						? 'bg-brain-accent text-black'
						: 'text-brain-muted hover:text-brain-text'}"
				>
					All
				</button>
				{#if facets.status['not-started'] > 0 || statusFilter === 'not-started'}
					<button
						onclick={() => setStatus(statusFilter === 'not-started' ? null : 'not-started')}
						class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === 'not-started'
							? 'bg-brain-muted/30 text-brain-text'
							: 'text-brain-muted hover:text-brain-text'}"
					>
						Planned ({facets.status['not-started']})
					</button>
				{/if}
				{#if facets.status['in-progress'] > 0 || statusFilter === 'in-progress'}
					<button
						onclick={() => setStatus(statusFilter === 'in-progress' ? null : 'in-progress')}
						class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === 'in-progress'
							? 'bg-amber-500/20 text-amber-400'
							: 'text-brain-muted hover:text-brain-text'}"
					>
						In Progress ({facets.status['in-progress']})
					</button>
				{/if}
				{#if facets.status['done'] > 0 || statusFilter === 'done'}
					<button
						onclick={() => setStatus(statusFilter === 'done' ? null : 'done')}
						class="rounded px-2.5 py-1 text-xs transition-colors {statusFilter === 'done'
							? 'bg-brain-green/20 text-brain-green'
							: 'text-brain-muted hover:text-brain-text'}"
					>
						Done ({facets.status['done']})
					</button>
				{/if}
			</div>
		{/if}

		<!-- Tag filters -->
		{#if facets && facets.tags.length > 0}
			<div class="mb-4 flex flex-wrap items-center gap-1.5">
				<span class="text-xs text-brain-muted">tags:</span>
				{#each facets.tags as tagFacet (tagFacet.tag)}
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

		<p class="mb-4 text-xs text-brain-muted">{data.total} memories</p>

		{#if data.memories.length > 0}
			<div class="space-y-2">
				{#each data.memories as entry (entry.memory_file)}
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
