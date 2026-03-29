<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browseKind, type BrowseKindResponse } from '$lib/brain';
	import { onMount } from 'svelte';

	let data = $state<BrowseKindResponse | null>(null);
	let error = $state<string | null>(null);
	let currentPath = $derived($page.params.path ?? '');

	onMount(() => load());

	$effect(() => {
		void currentPath;
		load();
	});

	async function load() {
		data = null;
		error = null;
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
		<p class="mb-4 text-xs text-brain-muted">{data.total} memories</p>

		{#if data.memories.length > 0}
			<div class="space-y-2">
				{#each data.memories as entry (entry.memory_file)}
					<a
						href={resolve('/memory/[file]', { file: encodeURIComponent(entry.memory_file) })}
						class="block rounded border border-brain-border bg-brain-surface p-3 transition-colors hover:border-brain-accent"
					>
						<div class="flex items-center gap-2 text-sm font-medium">
							{entry.title}
							{#if entry.progress}
								<span
									class="rounded border px-1.5 py-0.5 text-xs"
									class:border-brain-green={entry.progress.status === 'done'}
									class:text-brain-green={entry.progress.status === 'done'}
									class:border-amber-500={entry.progress.status === 'in-progress'}
									class:text-amber-500={entry.progress.status === 'in-progress'}
									class:border-brain-muted={entry.progress.status === 'not-started'}
									class:text-brain-muted={entry.progress.status === 'not-started'}
								>
									{entry.progress.checked}/{entry.progress.total}
								</span>
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
											// eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() used, query params appended
											goto(`${resolve('/search')}?tags=${encodeURIComponent(tag)}`);
										}}
										class="rounded bg-brain-bg px-1.5 py-0.5 text-xs text-brain-muted transition-colors hover:text-brain-accent"
										>{tag}</button
									>
								{/each}
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{:else}
			<p class="text-brain-muted">no memories in this kind</p>
		{/if}
	{/if}
</div>
