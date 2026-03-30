<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { searchMemories, type MemorySummary, type Facets } from '$lib/brain';
	import MemoryCard from '$lib/components/MemoryCard.svelte';
	import TagIcon from '$lib/components/TagIcon.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { onMount } from 'svelte';

	interface Column {
		label: string;
		status: 'not-started' | 'in-progress' | 'done';
		color: string;
		memories: MemorySummary[];
		total: number;
	}

	let columns = $state<Column[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let tagFacets = $state<Facets | null>(null);

	let activeTags = $derived($page.url.searchParams.getAll('tag'));

	onMount(() => load());

	$effect(() => {
		void activeTags;
		load();
	});

	async function load() {
		loading = true;
		error = null;
		try {
			const tags = activeTags.length > 0 ? activeTags : undefined;
			const [notStarted, inProgress, done] = await Promise.all([
				searchMemories({ status: 'not-started', sort: 'modified', order: 'desc', tags }),
				searchMemories({ status: 'in-progress', sort: 'modified', order: 'desc', tags }),
				searchMemories({ status: 'done', sort: 'modified', order: 'desc', tags })
			]);
			// Use facets from the largest result set for tag filtering
			tagFacets = notStarted.facets ?? inProgress.facets ?? done.facets ?? null;
			columns = [
				{
					label: 'Not Started',
					status: 'not-started',
					color: 'text-brain-muted',
					memories: notStarted.memories,
					total: notStarted.total
				},
				{
					label: 'In Progress',
					status: 'in-progress',
					color: 'text-amber-500',
					memories: inProgress.memories,
					total: inProgress.total
				},
				{
					label: 'Done',
					status: 'done',
					color: 'text-brain-green',
					memories: done.memories,
					total: done.total
				}
			];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load';
		} finally {
			loading = false;
		}
	}

	function toggleTag(tag: string) {
		const url = new URL($page.url);
		const current = url.searchParams.getAll('tag');
		url.searchParams.delete('tag');
		if (current.includes(tag)) {
			for (const t of current.filter((t) => t !== tag)) url.searchParams.append('tag', t);
		} else {
			for (const t of current) url.searchParams.append('tag', t);
			url.searchParams.append('tag', tag);
		}
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- URL built from current page
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	function clearTags() {
		const url = new URL($page.url);
		url.searchParams.delete('tag');
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- URL built from current page
		goto(url.toString(), { replaceState: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>Board | shipwright brain</title>
</svelte:head>

<div class="mx-auto max-w-7xl">
	<!-- Breadcrumb -->
	<nav class="mb-6 flex items-center gap-1.5 text-sm text-brain-muted">
		<a href={resolve('/')} class="hover:text-brain-text">home</a>
		<span>/</span>
		<span class="text-brain-text">board</span>
	</nav>

	<h1 class="mb-4 text-2xl font-semibold">Board</h1>

	<!-- Tag filters -->
	{#if tagFacets && tagFacets.tags.length > 0}
		<div class="mb-4 flex flex-wrap items-center gap-1.5">
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
					{tagFacet.tag}
					<span class="opacity-40">({tagFacet.count})</span>
				</button>
			{/each}
			{#if activeTags.length > 0}
				<button
					onclick={clearTags}
					class="cursor-pointer text-xs text-brain-muted hover:text-brain-text"
				>
					clear
				</button>
			{/if}
		</div>
	{/if}

	{#if loading}
		<Spinner />
	{:else if error}
		<div class="flex flex-col items-center py-12 text-center">
			<img src="/error-generic.svg" alt="Error" class="mb-6 h-40 w-auto opacity-80" />
			<p class="mb-2 text-lg font-medium text-brain-muted">Something went wrong</p>
			<p class="text-sm text-brain-muted/60">{error}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			{#each columns as col (col.status)}
				<div class="card-container min-h-[200px]">
					<div class="mb-3 flex items-center gap-2">
						<h2 class="text-sm font-semibold {col.color}">{col.label}</h2>
						<span class="text-xs text-brain-muted/40">{col.total}</span>
					</div>
					{#if col.memories.length > 0}
						<div class="space-y-2">
							{#each col.memories as mem (mem.memory_file)}
								<MemoryCard memory={mem} showKind />
							{/each}
						</div>
					{:else}
						<p class="py-8 text-center text-xs text-brain-muted/40">empty</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
