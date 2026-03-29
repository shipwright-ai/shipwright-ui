<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		browseRoot,
		browseKind,
		type BrowseRootResponse,
		type KindEntry,
		type MemorySummary
	} from '$lib/brain';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import { onMount } from 'svelte';

	let data = $state<BrowseRootResponse | null>(null);
	let error = $state<string | null>(null);
	let singleMemories = $state<Record<string, MemorySummary>>({});

	let multiKinds = $derived(data?.kinds.filter((k: KindEntry) => (k.count ?? 0) > 1) ?? []);
	let singleKinds = $derived(data?.kinds.filter((k: KindEntry) => (k.count ?? 0) === 1) ?? []);

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
		<div class="rounded border border-brain-red/30 bg-brain-red/10 p-4 text-sm text-brain-red">
			{error}
		</div>
	{:else if !data}
		<p class="text-brain-muted">loading...</p>
	{:else}
		<h2 class="mb-4 text-xl font-semibold">memory kinds</h2>

		{#if data.kinds.length > 0}
			<!-- Multi-memory kinds (grid cards linking to browse) -->
			{#if multiKinds.length > 0}
				<div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each multiKinds as kind (kind.kind)}
						<a
							href={resolve('/browse/[...path]', { path: kind.kind })}
							class="block rounded border border-brain-border bg-brain-surface p-4 transition-colors hover:border-brain-accent"
						>
							<div class="flex items-center gap-2">
								<span class="text-sm font-medium capitalize">{kind.kind}</span>
								{#if kind.count}
									<span class="text-xs text-brain-muted">{kind.count}</span>
								{/if}
								{#if kind.progress}
									<ProgressBadge progress={kind.progress} />
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}

			<!-- Single-memory kinds (expanded inline, link to detail) -->
			{#if singleKinds.length > 0}
				<div class="space-y-2">
					{#each singleKinds as kind (kind.kind)}
						{@const memory = singleMemories[kind.kind]}
						{#if memory}
							<a
								href={resolve('/memory/[...path]', { path: memory.memory_file })}
								class="block rounded border border-brain-border bg-brain-surface p-4 transition-colors hover:border-brain-accent"
							>
								<div class="flex items-center gap-2">
									<span class="text-xs text-brain-muted capitalize">{kind.kind}</span>
									<span class="text-sm font-medium">{memory.title}</span>
									{#if memory.progress}
										<ProgressBadge progress={memory.progress} />
									{/if}
								</div>
								{#if memory.summary}
									<p class="mt-1 text-xs text-brain-muted">{memory.summary}</p>
								{/if}
							</a>
						{:else}
							<a
								href={resolve('/browse/[...path]', { path: kind.kind })}
								class="block rounded border border-brain-border bg-brain-surface p-4 transition-colors hover:border-brain-accent"
							>
								<span class="text-sm font-medium capitalize">{kind.kind}</span>
							</a>
						{/if}
					{/each}
				</div>
			{/if}
		{:else}
			<p class="text-brain-muted">brain is empty</p>
		{/if}
	{/if}
</div>
