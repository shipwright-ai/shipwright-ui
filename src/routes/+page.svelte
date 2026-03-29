<script lang="ts">
	import { resolve } from '$app/paths';
	import { browse, type BrowseResponse } from '$lib/brain';
	import { onMount } from 'svelte';

	let data = $state<BrowseResponse | null>(null);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			data = await browse();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to connect to Brain';
		}
	});
</script>

<div class="mx-auto max-w-4xl">
	{#if error}
		<div class="rounded border border-brain-red/30 bg-brain-red/10 p-4 text-sm text-brain-red">
			{error}
		</div>
	{:else if !data}
		<p class="text-brain-muted">loading...</p>
	{:else}
		<h2 class="mb-4 text-xl font-semibold">memory kinds</h2>

		{#if data.children.length > 0}
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.children as child (child)}
					<a
						href={resolve('/browse/[...path]', { path: child })}
						class="block rounded border border-brain-border bg-brain-surface p-4 transition-colors hover:border-brain-accent"
					>
						<span class="text-sm font-medium">{child}</span>
					</a>
				{/each}
			</div>
		{/if}

		{#if data.entries.length > 0}
			<div class="mt-6 space-y-2">
				{#each data.entries as entry (entry.memory_file)}
					<a
						href={resolve('/memory/[file]', { file: encodeURIComponent(entry.memory_file) })}
						class="block rounded border border-brain-border bg-brain-surface p-3 transition-colors hover:border-brain-accent"
					>
						<div class="text-sm font-medium">{entry.title}</div>
						{#if entry.summary}
							<div class="mt-1 text-xs text-brain-muted">{entry.summary}</div>
						{/if}
						{#if entry.tags.length > 0}
							<div class="mt-2 flex gap-1.5">
								{#each entry.tags as tag (tag)}
									<span class="rounded bg-brain-bg px-1.5 py-0.5 text-xs text-brain-muted"
										>{tag}</span
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
