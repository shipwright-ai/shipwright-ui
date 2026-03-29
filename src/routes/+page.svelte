<script lang="ts">
	import { resolve } from '$app/paths';
	import { browseRoot, type BrowseRootResponse } from '$lib/brain';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import { onMount } from 'svelte';

	let data = $state<BrowseRootResponse | null>(null);
	let error = $state<string | null>(null);

	onMount(async () => {
		try {
			data = await browseRoot();
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
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.kinds as kind (kind.kind)}
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
		{:else}
			<p class="text-brain-muted">brain is empty</p>
		{/if}
	{/if}
</div>
