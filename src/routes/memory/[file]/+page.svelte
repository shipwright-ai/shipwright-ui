<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { getMemory, fileUrl, type MemoryEntry } from '$lib/brain';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	let entry = $state<MemoryEntry | null>(null);
	let error = $state<string | null>(null);
	let html = $state('');

	const file = $derived(decodeURIComponent($page.params.file ?? ''));

	onMount(() => load());

	$effect(() => {
		void file;
		load();
	});

	async function load() {
		entry = null;
		error = null;
		html = '';
		try {
			entry = await getMemory(file);
			// Rewrite image paths to use Brain file API
			const content = entry.content.replace(
				/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g,
				(_, alt, src) => `![${alt}](${fileUrl(src)})`
			);
			html = await marked.parse(content);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load memory';
		}
	}

	function parentPath(memoryFile: string): string {
		const parts = memoryFile.split('/');
		parts.pop(); // memory.md
		return '/browse/' + parts.join('/');
	}
</script>

<div class="mx-auto max-w-4xl">
	{#if error}
		<div class="rounded border border-brain-red/30 bg-brain-red/10 p-4 text-sm text-brain-red">
			{error}
		</div>
	{:else if !entry}
		<p class="text-brain-muted">loading...</p>
	{:else}
		<!-- Breadcrumb -->
		<nav class="mb-6 flex items-center gap-1.5 text-sm text-brain-muted">
			<a href={resolve('/')} class="hover:text-brain-text">home</a>
			<span>/</span>
			<a
				href={resolve('/browse/[...path]', {
					path: parentPath(entry.memory_file).replace('/browse/', '')
				})}
				class="hover:text-brain-text">{entry.kind}</a
			>
			<span>/</span>
			<span class="text-brain-text">{entry.title}</span>
		</nav>

		<!-- Header -->
		<div class="mb-6">
			<h1 class="text-2xl font-semibold">{entry.title}</h1>
			{#if entry.summary}
				<p class="mt-1 text-brain-muted">{entry.summary}</p>
			{/if}
			<div class="mt-3 flex items-center gap-3">
				<span class="rounded bg-brain-accent/20 px-2 py-0.5 text-xs text-brain-accent"
					>{entry.kind}</span
				>
				{#each entry.tags as tag (tag)}
					<span
						class="rounded border border-brain-border bg-brain-bg px-1.5 py-0.5 text-xs text-brain-muted"
						>{tag}</span
					>
				{/each}
			</div>
		</div>

		<!-- Content -->
		<article class="prose prose-sm max-w-none prose-invert">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendering trusted markdown from Brain API -->
			{@html html}
		</article>

		<!-- Children -->
		{#if entry.children.length > 0}
			<div class="mt-8 border-t border-brain-border pt-6">
				<h3 class="mb-3 text-sm font-semibold text-brain-muted">related memories</h3>
				<div class="space-y-2">
					{#each entry.children as child (child)}
						<a
							href={resolve('/memory/[file]', { file: encodeURIComponent(child) })}
							class="block rounded border border-brain-border bg-brain-surface p-3 text-sm transition-colors hover:border-brain-accent"
						>
							{child}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
