<script lang="ts">
	import { resolve } from '$app/paths';
	import { searchMemories, type SearchResponse } from '$lib/brain';

	let query = $state('');
	let data = $state<SearchResponse | null>(null);
	let searched = $state(false);
	let loading = $state(false);

	async function doSearch() {
		if (!query.trim()) return;
		loading = true;
		searched = true;
		try {
			data = await searchMemories(query.trim());
		} catch {
			data = null;
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto max-w-4xl">
	<h2 class="mb-4 text-xl font-semibold">search memories</h2>

	<form
		onsubmit={(e) => {
			e.preventDefault();
			doSearch();
		}}
		class="mb-6 flex gap-2"
	>
		<input
			type="text"
			bind:value={query}
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

	{#if loading}
		<p class="text-brain-muted">searching...</p>
	{:else if searched && (!data || data.memories.length === 0)}
		<p class="text-brain-muted">no results found</p>
	{:else if data}
		<p class="mb-3 text-xs text-brain-muted">{data.total} results</p>
		<div class="space-y-2">
			{#each data.memories as result (result.memory_file)}
				<a
					href={resolve('/memory/[file]', { file: encodeURIComponent(result.memory_file) })}
					class="block rounded border border-brain-border bg-brain-surface p-3 transition-colors hover:border-brain-accent"
				>
					<div class="flex items-center gap-2">
						<span class="rounded bg-brain-bg px-1.5 py-0.5 text-xs text-brain-accent"
							>{result.kind}</span
						>
						<span class="text-sm font-medium">{result.title}</span>
					</div>
					{#if result.summary}
						<div class="mt-1 text-xs text-brain-muted">{result.summary}</div>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
