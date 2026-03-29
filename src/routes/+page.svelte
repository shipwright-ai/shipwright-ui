<script lang="ts">
	import { resolve } from '$app/paths';
	import { browseRoot, browseKind, type BrowseRootResponse, type MemorySummary } from '$lib/brain';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import heroImg from '$lib/assets/shipwright-hero.png';
	import { onMount } from 'svelte';

	let data = $state<BrowseRootResponse | null>(null);
	let error = $state<string | null>(null);
	let singleMemories = $state<Record<string, MemorySummary>>({});

	onMount(async () => {
		try {
			data = await browseRoot();
			// Fetch single-memory kinds to get their memory details
			const singles = data.kinds.filter((k) => (k.count ?? 0) === 1);
			const results = await Promise.all(singles.map((k) => browseKind(k.kind)));
			const rec: Record<string, MemorySummary> = {};
			for (const result of results) {
				if (result.memories.length > 0) {
					rec[result.kind] = result.memories[0];
				}
			}
			singleMemories = rec;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to connect to Brain';
		}
	});
</script>

<div class="mx-auto max-w-4xl">
	{#if error}
		<div class="flex flex-col items-center py-12 text-center">
			<img src="/error-generic.svg" alt="Connection error" class="mb-6 h-48 w-auto" />
			<h2 class="mb-2 text-2xl font-semibold">Ship ran aground</h2>
			<p class="mb-2 text-brain-muted">Can't reach the Brain — is the server running?</p>
			<p class="mb-6 text-xs text-brain-muted/60">{error}</p>
			<button
				onclick={() => location.reload()}
				class="rounded bg-brain-accent px-4 py-2 text-sm text-white transition-colors hover:bg-brain-accent/80"
			>
				Try again
			</button>
		</div>
	{:else if !data}
		<Spinner />
	{:else}
		<!-- Hero -->
		<div class="mb-8 flex flex-col items-center">
			<img src={heroImg} alt="Shipwright Brain" class="mb-4 h-40 w-40 object-contain" />
			<h2 class="text-xl font-semibold">memory kinds</h2>
		</div>

		{#if data.kinds.length > 0}
			<div class="space-y-2">
				{#each [...data.kinds].sort((a, b) => (b.progress ? 1 : 0) - (a.progress ? 1 : 0)) as kind (kind.kind)}
					{@const memory = singleMemories[kind.kind]}
					{@const isSingle = (kind.count ?? 0) === 1 && memory}
					{#if isSingle}
						<a
							href={resolve('/memory/[...path]', { path: memory.memory_file })}
							class="block rounded border border-brain-border bg-brain-surface p-4 transition-colors hover:border-brain-accent"
						>
							<div class="flex items-center gap-2">
								<span class="text-xs text-brain-muted capitalize">{kind.kind}</span>
								<span class="text-sm font-medium">{memory.title}</span>
								{#if memory.children > 0}
									<span class="text-xs text-brain-muted/60">{memory.children} sub-memories</span>
								{/if}
								{#if kind.progress}
									<ProgressBadge progress={kind.progress} />
								{/if}
							</div>
						</a>
					{:else}
						<a
							href={resolve('/browse/[...path]', { path: kind.kind })}
							class="block rounded border border-brain-border bg-brain-surface p-4 transition-colors hover:border-brain-accent"
						>
							<div class="flex items-center gap-2">
								<span class="text-xs text-brain-muted capitalize">{kind.kind}</span>
								{#if kind.count}
									<span class="text-sm font-medium">{kind.count} memories</span>
								{/if}
								{#if kind.totalCount && kind.totalCount > (kind.count ?? 0)}
									<span class="text-xs text-brain-muted/60"
										>+{kind.totalCount - (kind.count ?? 0)} nested</span
									>
								{/if}
								{#if kind.progress}
									<ProgressBadge progress={kind.progress} />
								{/if}
							</div>
						</a>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center py-12 text-center">
				<img src="/error-404.svg" alt="Empty" class="mb-6 h-40 w-auto opacity-60" />
				<p class="text-lg font-medium text-brain-muted">Brain is empty</p>
				<p class="mt-1 text-sm text-brain-muted/60">No memories yet — start creating!</p>
			</div>
		{/if}
	{/if}
</div>
